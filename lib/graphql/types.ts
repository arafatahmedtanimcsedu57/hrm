// GraphQL Type Definitions
export interface Organization {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  createdAt: string
  companies: Company[]
}

export interface Company {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  createdAt: string
  organizationId: string
  branches: Branch[]
}

export interface Branch {
  id: string
  name: string
  description?: string
  address?: string
  phone?: string
  email?: string
  createdAt: string
  companyId: string
  departments: Department[]
}

export interface Department {
  id: string
  name: string
  description?: string
  createdAt: string
  branchId: string
  divisions: Division[]
}

export interface Division {
  id: string
  name: string
  description?: string
  createdAt: string
  departmentId: string
  sections: Section[]
}

export interface Section {
  id: string
  name: string
  description?: string
  createdAt: string
  divisionId: string
  subSections: SubSection[]
}

export interface SubSection {
  id: string
  name: string
  description?: string
  createdAt: string
  sectionId: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  designation: string
  department?: string
  status: "active" | "inactive"
  createdAt: string
  organizationId?: string
  assignments: OrganizationalAssignment[]
}

export interface OrganizationalAssignment {
  organizationId: string
  companyIds: string[]
  branchIds: string[]
  departmentIds: string[]
  divisionIds: string[]
  sectionIds: string[]
  subSectionIds: string[]
}

export interface Designation {
  id: string
  name: string
  description?: string
  level: number
  createdAt: string
}

export interface AuthPayload {
  token: string
  user: {
    id: string
    email: string
    role: string
  }
}
