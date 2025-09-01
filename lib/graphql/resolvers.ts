// Client-side resolvers that read from localStorage
// This will be replaced when connecting to your NestJS backend

export const clientResolvers = {
  Query: {
    organizations: () => {
      const stored = localStorage.getItem("hrm_organizations")
      return stored ? JSON.parse(stored) : []
    },

    organization: (_: any, { id }: { id: string }) => {
      const stored = localStorage.getItem("hrm_organizations")
      const organizations = stored ? JSON.parse(stored) : []
      return organizations.find((org: any) => org.id === id) || null
    },

    users: () => {
      const stored = localStorage.getItem("hrm_users")
      return stored ? JSON.parse(stored) : []
    },

    user: (_: any, { id }: { id: string }) => {
      const stored = localStorage.getItem("hrm_users")
      const users = stored ? JSON.parse(stored) : []
      return users.find((user: any) => user.id === id) || null
    },

    designations: () => {
      const stored = localStorage.getItem("hrm_designations")
      if (!stored) {
        // Return default designations
        const defaultDesignations = [
          {
            id: "1",
            name: "Manager",
            description: "Team management and oversight",
            level: 5,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Team Lead",
            description: "Lead a team of employees",
            level: 4,
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Senior Employee",
            description: "Experienced team member",
            level: 3,
            createdAt: new Date().toISOString(),
          },
          {
            id: "4",
            name: "Employee",
            description: "Regular team member",
            level: 2,
            createdAt: new Date().toISOString(),
          },
          {
            id: "5",
            name: "Intern",
            description: "Learning and training position",
            level: 1,
            createdAt: new Date().toISOString(),
          },
        ]
        localStorage.setItem("hrm_designations", JSON.stringify(defaultDesignations))
        return defaultDesignations
      }
      return JSON.parse(stored)
    },

    dashboardStats: () => {
      const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      const users = JSON.parse(localStorage.getItem("hrm_users") || "[]")

      let totalCompanies = 0
      let totalBranches = 0

      organizations.forEach((org: any) => {
        totalCompanies += org.companies?.length || 0
        org.companies?.forEach((company: any) => {
          totalBranches += company.branches?.length || 0
        })
      })

      return {
        organizations: organizations.length,
        companies: totalCompanies,
        branches: totalBranches,
        employees: users.length,
      }
    },
  },

  Mutation: {
    login: (_: any, { email, password }: { email: string; password: string }) => {
      // Mock authentication - replace with real authentication
      if (email && password) {
        const token = "mock-jwt-token-" + Date.now()
        localStorage.setItem("hrm_auth_token", token)
        localStorage.setItem("hrm_admin_logged_in", "true")
        localStorage.setItem("hrm_admin_email", email)

        return {
          token,
          user: {
            id: "1",
            email,
            role: "admin",
          },
        }
      }
      throw new Error("Invalid credentials")
    },

    logout: () => {
      localStorage.removeItem("hrm_auth_token")
      localStorage.removeItem("hrm_admin_logged_in")
      localStorage.removeItem("hrm_admin_email")
      return true
    },

    createOrganization: (_: any, { input }: { input: any }) => {
      const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      const newOrg = {
        id: Date.now().toString(),
        ...input,
        createdAt: new Date().toISOString(),
        companies: [],
      }
      organizations.push(newOrg)
      localStorage.setItem("hrm_organizations", JSON.stringify(organizations))
      return newOrg
    },

    createUser: (_: any, { input }: { input: any }) => {
      const users = JSON.parse(localStorage.getItem("hrm_users") || "[]")
      const newUser = {
        id: Date.now().toString(),
        ...input,
        createdAt: new Date().toISOString(),
        status: "active",
      }
      users.push(newUser)
      localStorage.setItem("hrm_users", JSON.stringify(users))
      return newUser
    },

    createDesignation: (_: any, { input }: { input: any }) => {
      const designations = JSON.parse(localStorage.getItem("hrm_designations") || "[]")
      const newDesignation = {
        id: Date.now().toString(),
        ...input,
        createdAt: new Date().toISOString(),
      }
      designations.push(newDesignation)
      localStorage.setItem("hrm_designations", JSON.stringify(designations))
      return newDesignation
    },

    // Add more mutations as needed...
  },
}
