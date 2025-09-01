import { useQuery, useMutation, useApolloClient } from "@apollo/client"
import {
  GET_ORGANIZATIONS,
  GET_ORGANIZATION,
  GET_USERS,
  GET_USER,
  GET_DESIGNATIONS,
  GET_DASHBOARD_STATS,
} from "./queries"
import { LOGIN, LOGOUT, CREATE_ORGANIZATION, CREATE_USER, CREATE_DESIGNATION } from "./mutations"

// Custom hooks for GraphQL operations
export const useOrganizations = () => {
  return useQuery(GET_ORGANIZATIONS, {
    errorPolicy: "all",
  })
}

export const useOrganization = (id: string) => {
  return useQuery(GET_ORGANIZATION, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  })
}

export const useUsers = () => {
  return useQuery(GET_USERS, {
    errorPolicy: "all",
  })
}

export const useUser = (id: string) => {
  return useQuery(GET_USER, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  })
}

export const useDesignations = () => {
  return useQuery(GET_DESIGNATIONS, {
    errorPolicy: "all",
  })
}

export const useDashboardStats = () => {
  return useQuery(GET_DASHBOARD_STATS, {
    errorPolicy: "all",
  })
}

// Mutation hooks
export const useLogin = () => {
  const client = useApolloClient()

  return useMutation(LOGIN, {
    onCompleted: (data) => {
      // Store auth data
      localStorage.setItem("hrm_auth_token", data.login.token)
      localStorage.setItem("hrm_admin_logged_in", "true")
      localStorage.setItem("hrm_admin_email", data.login.user.email)
    },
    onError: (error) => {
      console.error("Login error:", error)
    },
  })
}

export const useLogout = () => {
  const client = useApolloClient()

  return useMutation(LOGOUT, {
    onCompleted: () => {
      // Clear auth data and cache
      localStorage.removeItem("hrm_auth_token")
      localStorage.removeItem("hrm_admin_logged_in")
      localStorage.removeItem("hrm_admin_email")
      client.clearStore()
    },
  })
}

export const useCreateOrganization = () => {
  return useMutation(CREATE_ORGANIZATION, {
    refetchQueries: [GET_ORGANIZATIONS, GET_DASHBOARD_STATS],
    awaitRefetchQueries: true,
  })
}

export const useCreateUser = () => {
  return useMutation(CREATE_USER, {
    refetchQueries: [GET_USERS, GET_DASHBOARD_STATS],
    awaitRefetchQueries: true,
  })
}

export const useCreateDesignation = () => {
  return useMutation(CREATE_DESIGNATION, {
    refetchQueries: [GET_DESIGNATIONS],
    awaitRefetchQueries: true,
  })
}
