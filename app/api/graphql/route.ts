import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { gql } from "graphql-tag"

// GraphQL Schema Definition
const typeDefs = gql`
  type Organization {
    id: ID!
    name: String!
    description: String
    address: String
    phone: String
    email: String
    createdAt: String!
    companies: [Company!]!
  }

  type Company {
    id: ID!
    name: String!
    description: String
    address: String
    phone: String
    email: String
    createdAt: String!
    organizationId: ID!
    branches: [Branch!]!
  }

  type Branch {
    id: ID!
    name: String!
    description: String
    address: String
    phone: String
    email: String
    createdAt: String!
    companyId: ID!
    departments: [Department!]!
  }

  type Department {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    branchId: ID!
    divisions: [Division!]!
  }

  type Division {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    departmentId: ID!
    sections: [Section!]!
  }

  type Section {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    divisionId: ID!
    subSections: [SubSection!]!
  }

  type SubSection {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    sectionId: ID!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    designation: String!
    department: String
    status: UserStatus!
    createdAt: String!
    organizationId: String
    assignments: [OrganizationalAssignment!]!
  }

  type OrganizationalAssignment {
    organizationId: String!
    companyIds: [String!]!
    branchIds: [String!]!
    departmentIds: [String!]!
    divisionIds: [String!]!
    sectionIds: [String!]!
    subSectionIds: [String!]!
  }

  type Designation {
    id: ID!
    name: String!
    description: String
    level: Int!
    createdAt: String!
  }

  type DashboardStats {
    organizations: Int!
    companies: Int!
    branches: Int!
    employees: Int!
  }

  type AuthPayload {
    token: String!
    user: AuthUser!
  }

  type AuthUser {
    id: ID!
    email: String!
    role: String!
  }

  enum UserStatus {
    active
    inactive
  }

  input CreateOrganizationInput {
    name: String!
    description: String
    address: String
    phone: String
    email: String
  }

  input UpdateOrganizationInput {
    name: String
    description: String
    address: String
    phone: String
    email: String
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String
    designation: String!
    department: String
    organizationId: String
    assignments: [OrganizationalAssignmentInput!]!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    phone: String
    designation: String
    department: String
    status: UserStatus
    assignments: [OrganizationalAssignmentInput!]
  }

  input OrganizationalAssignmentInput {
    organizationId: String!
    companyIds: [String!]!
    branchIds: [String!]!
    departmentIds: [String!]!
    divisionIds: [String!]!
    sectionIds: [String!]!
    subSectionIds: [String!]!
  }

  input CreateDesignationInput {
    name: String!
    description: String
    level: Int!
  }

  input UpdateDesignationInput {
    name: String
    description: String
    level: Int
  }

  type Query {
    organizations: [Organization!]!
    organization(id: ID!): Organization
    users: [User!]!
    user(id: ID!): User
    designations: [Designation!]!
    dashboardStats: DashboardStats!
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
    createOrganization(input: CreateOrganizationInput!): Organization!
    updateOrganization(id: ID!, input: UpdateOrganizationInput!): Organization!
    deleteOrganization(id: ID!): Boolean!
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
    createDesignation(input: CreateDesignationInput!): Designation!
    updateDesignation(id: ID!, input: UpdateDesignationInput!): Designation!
    deleteDesignation(id: ID!): Boolean!
  }
`

// Mock resolvers that read from localStorage (server-side simulation)
const resolvers = {
  Query: {
    organizations: () => {
      // In a real app, this would query your database
      // For now, we'll return mock data that matches localStorage structure
      return []
    },
    dashboardStats: () => ({
      organizations: 0,
      companies: 0,
      branches: 0,
      employees: 0,
    }),
  },
  Mutation: {
    login: (_: any, { email, password }: { email: string; password: string }) => {
      if (email && password) {
        return {
          token: "mock-jwt-token-" + Date.now(),
          user: {
            id: "1",
            email,
            role: "admin",
          },
        }
      }
      throw new Error("Invalid credentials")
    },
    logout: () => true,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => ({ req }),
})

export { handler as GET, handler as POST }
