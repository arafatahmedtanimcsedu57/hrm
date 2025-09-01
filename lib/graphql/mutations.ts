import { gql } from "@apollo/client"

// Authentication Mutations
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

// Organization Mutations
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
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
        createdAt
      }
    }
  }
`

export const UPDATE_ORGANIZATION = gql`
  mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      id
      name
      description
      address
      phone
      email
      createdAt
    }
  }
`

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id)
  }
`

// Company Mutations
export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      description
      address
      phone
      email
      createdAt
      organizationId
    }
  }
`

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      description
      address
      phone
      email
      createdAt
    }
  }
`

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id)
  }
`

// Branch Mutations
export const CREATE_BRANCH = gql`
  mutation CreateBranch($input: CreateBranchInput!) {
    createBranch(input: $input) {
      id
      name
      description
      address
      phone
      email
      createdAt
      companyId
    }
  }
`

export const UPDATE_BRANCH = gql`
  mutation UpdateBranch($id: ID!, $input: UpdateBranchInput!) {
    updateBranch(id: $id, input: $input) {
      id
      name
      description
      address
      phone
      email
      createdAt
    }
  }
`

export const DELETE_BRANCH = gql`
  mutation DeleteBranch($id: ID!) {
    deleteBranch(id: $id)
  }
`

// Department Mutations
export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      description
      createdAt
      branchId
    }
  }
`

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: ID!, $input: UpdateDepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      id
      name
      description
      createdAt
    }
  }
`

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`

// Division Mutations
export const CREATE_DIVISION = gql`
  mutation CreateDivision($input: CreateDivisionInput!) {
    createDivision(input: $input) {
      id
      name
      description
      createdAt
      departmentId
    }
  }
`

export const UPDATE_DIVISION = gql`
  mutation UpdateDivision($id: ID!, $input: UpdateDivisionInput!) {
    updateDivision(id: $id, input: $input) {
      id
      name
      description
      createdAt
    }
  }
`

export const DELETE_DIVISION = gql`
  mutation DeleteDivision($id: ID!) {
    deleteDivision(id: $id)
  }
`

// Section Mutations
export const CREATE_SECTION = gql`
  mutation CreateSection($input: CreateSectionInput!) {
    createSection(input: $input) {
      id
      name
      description
      createdAt
      divisionId
    }
  }
`

export const UPDATE_SECTION = gql`
  mutation UpdateSection($id: ID!, $input: UpdateSectionInput!) {
    updateSection(id: $id, input: $input) {
      id
      name
      description
      createdAt
    }
  }
`

export const DELETE_SECTION = gql`
  mutation DeleteSection($id: ID!) {
    deleteSection(id: $id)
  }
`

// SubSection Mutations
export const CREATE_SUBSECTION = gql`
  mutation CreateSubSection($input: CreateSubSectionInput!) {
    createSubSection(input: $input) {
      id
      name
      description
      createdAt
      sectionId
    }
  }
`

export const UPDATE_SUBSECTION = gql`
  mutation UpdateSubSection($id: ID!, $input: UpdateSubSectionInput!) {
    updateSubSection(id: $id, input: $input) {
      id
      name
      description
      createdAt
    }
  }
`

export const DELETE_SUBSECTION = gql`
  mutation DeleteSubSection($id: ID!) {
    deleteSubSection(id: $id)
  }
`

// User Mutations
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`

// Designation Mutations
export const CREATE_DESIGNATION = gql`
  mutation CreateDesignation($input: CreateDesignationInput!) {
    createDesignation(input: $input) {
      id
      name
      description
      level
      createdAt
    }
  }
`

export const UPDATE_DESIGNATION = gql`
  mutation UpdateDesignation($id: ID!, $input: UpdateDesignationInput!) {
    updateDesignation(id: $id, input: $input) {
      id
      name
      description
      level
      createdAt
    }
  }
`

export const DELETE_DESIGNATION = gql`
  mutation DeleteDesignation($id: ID!) {
    deleteDesignation(id: $id)
  }
`
