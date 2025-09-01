"use client"

import React, { createContext, useContext, type ReactNode } from "react"
import { graphqlClient } from "@/lib/graphql-client"

interface GraphQLContextType {
  client: typeof graphqlClient
  query: <T = any>(query: string, variables?: Record<string, any>) => Promise<{ data: T }>
  mutate: <T = any>(mutation: string, variables?: Record<string, any>) => Promise<{ data: T }>
}

const GraphQLContext = createContext<GraphQLContextType | undefined>(undefined)

export function GraphQLProvider({ children }: { children: ReactNode }) {
  const contextValue: GraphQLContextType = {
    client: graphqlClient,
    query: graphqlClient.query.bind(graphqlClient),
    mutate: graphqlClient.mutate.bind(graphqlClient),
  }

  return <GraphQLContext.Provider value={contextValue}>{children}</GraphQLContext.Provider>
}

export function useGraphQL() {
  const context = useContext(GraphQLContext)
  if (context === undefined) {
    throw new Error("useGraphQL must be used within a GraphQLProvider")
  }
  return context
}

// Custom hooks for common operations
export function useQuery<T = any>(query: string, variables?: Record<string, any>) {
  const { query: executeQuery } = useGraphQL()
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await executeQuery<T>(query, variables)
        setData(result.data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query, variables, executeQuery])

  return { data, loading, error }
}

export function useMutation<T = any>(mutation: string) {
  const { mutate } = useGraphQL()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const executeMutation = async (variables?: Record<string, any>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutate<T>(mutation, variables)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return [executeMutation, { loading, error }] as const
}
