import { gql } from "@apollo/client"

// Organization Queries
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      description
      address
      phone
      email
      createdAt
      companies {
        id
        name
        description
        address
        phone
        email
        createdAt
        branches {
          id
          name
          description
          address
          phone
          email
          createdAt
          departments {
            id
            name
            description
            createdAt
            divisions {
              id
              name
              description
              createdAt
              sections {
                id
                name
                description
                createdAt
                subSections {
                  id
                  name
                  description
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_ORGANIZATION = gql`
  query GetOrganization($id: ID!) {
    organization(id: $id) {
      id
      name
      description
      address
      phone
      email
      createdAt
      companies {
        id
        name
        description
        address
        phone
        email
        createdAt
        branches {
          id
          name
          description
          address
          phone
          email
          createdAt
          departments {
            id
            name
            description
            createdAt
            divisions {
              id
              name
              description
              createdAt
              sections {
                id
                name
                description
                createdAt
                subSections {
                  id
                  name
                  description
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  }
`

// User Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      email
      phone
      designation
      department
      status
      createdAt
      organizationId
      assignments {
        organizationId
        companyIds
        branchIds
        departmentIds
        divisionIds
        sectionIds
        subSectionIds
      }
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      phone
      designation
      department
      status
      createdAt
      organizationId
      assignments {
        organizationId
        companyIds
        branchIds
        departmentIds
        divisionIds
        sectionIds
        subSectionIds
      }
    }
  }
`

// Designation Queries
export const GET_DESIGNATIONS = gql`
  query GetDesignations {
    designations {
      id
      name
      description
      level
      createdAt
    }
  }
`

// Dashboard Stats Query
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      organizations
      companies
      branches
      employees
    }
  }
`
