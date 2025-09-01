"use client"

import type React from "react"
import { GraphQLProvider } from "./graphql-provider"

interface GraphQLProviderWrapperProps {
  children: React.ReactNode
}

export function ApolloProviderWrapper({ children }: GraphQLProviderWrapperProps) {
  return <GraphQLProvider>{children}</GraphQLProvider>
}
