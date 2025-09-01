"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, ArrowLeft, Plus, Users, Mail, Phone, MapPin } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  status: "active" | "inactive"
  createdAt: string
  organizationId?: string
  companyId?: string
  branchId?: string
  departmentId?: string
  divisionId?: string
  sectionId?: string
  subSectionId?: string
}

export default function UsersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("hrm_admin_logged_in")
    if (loggedIn !== "true") {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      // Load users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem("hrm_users") || "[]")
      setUsers(storedUsers)
    }
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">User Management</h1>
              </div>
            </div>
            <Button onClick={() => router.push("/users/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {users.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Users Found</CardTitle>
              <CardDescription className="mb-4">
                Get started by adding your first employee to the system.
              </CardDescription>
              <Button onClick={() => router.push("/users/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First User
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">All Users</h2>
                <p className="text-muted-foreground">{users.length} total users</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </CardTitle>
                    <CardDescription>{user.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.department && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{user.department}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground mb-4">
                      Added {new Date(user.createdAt).toLocaleDateString()}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push(`/users/${user.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
