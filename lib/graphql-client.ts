"use client"

// Custom GraphQL client that reads from localStorage
export class GraphQLClient {
  private endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async query<T = any>(query: string, variables?: Record<string, any>): Promise<{ data: T }> {
    // For now, handle queries locally since we're reading from localStorage
    return this.handleLocalQuery(query, variables)
  }

  async mutate<T = any>(mutation: string, variables?: Record<string, any>): Promise<{ data: T }> {
    // For now, handle mutations locally since we're writing to localStorage
    return this.handleLocalMutation(mutation, variables)
  }

  private handleLocalQuery(query: string, variables?: Record<string, any>): any {
    // Parse query type and handle accordingly
    if (query.includes("getOrganizations")) {
      const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      return { data: { organizations } }
    }

    if (query.includes("getUsers")) {
      const users = JSON.parse(localStorage.getItem("hrm_users") || "[]")
      return { data: { users } }
    }

    if (query.includes("getDesignations")) {
      const designations = JSON.parse(localStorage.getItem("hrm_designations") || "[]")
      return { data: { designations } }
    }

    return { data: null }
  }

  private handleLocalMutation(mutation: string, variables?: Record<string, any>): any {
    if (mutation.includes("createOrganization")) {
      const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      const newOrg = {
        id: Date.now().toString(),
        ...variables?.input,
        createdAt: new Date().toISOString(),
        companies: [],
      }
      organizations.push(newOrg)
      localStorage.setItem("hrm_organizations", JSON.stringify(organizations))
      return { data: { createOrganization: newOrg } }
    }

    if (mutation.includes("createUser")) {
      const users = JSON.parse(localStorage.getItem("hrm_users") || "[]")
      const newUser = {
        id: Date.now().toString(),
        ...variables?.input,
        createdAt: new Date().toISOString(),
      }
      users.push(newUser)
      localStorage.setItem("hrm_users", JSON.stringify(users))
      return { data: { createUser: newUser } }
    }

    if (mutation.includes("createDesignation")) {
      const designations = JSON.parse(localStorage.getItem("hrm_designations") || "[]")
      const newDesignation = {
        id: Date.now().toString(),
        ...variables?.input,
        createdAt: new Date().toISOString(),
      }
      designations.push(newDesignation)
      localStorage.setItem("hrm_designations", JSON.stringify(designations))
      return { data: { createDesignation: newDesignation } }
    }

    return { data: null }
  }
}

export const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "/api/graphql")
