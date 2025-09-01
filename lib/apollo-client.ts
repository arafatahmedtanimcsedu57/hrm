import { GraphQLClient } from "./graphql-client"

// Create a simple GraphQL client for local development
export const apolloClient = new GraphQLClient({
  endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "/api/graphql",
})
