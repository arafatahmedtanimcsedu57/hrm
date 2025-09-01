import { ApolloClient, InMemoryCache } from "@apollo/client"

// Create a simple Apollo Client for local development
export const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "/api/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Organization: {
        fields: {
          companies: {
            merge: false, // Replace the array instead of merging
          },
        },
      },
      Company: {
        fields: {
          branches: {
            merge: false,
          },
        },
      },
      Branch: {
        fields: {
          departments: {
            merge: false,
          },
        },
      },
      Department: {
        fields: {
          divisions: {
            merge: false,
          },
        },
      },
      Division: {
        fields: {
          sections: {
            merge: false,
          },
        },
      },
      Section: {
        fields: {
          subSections: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
})
