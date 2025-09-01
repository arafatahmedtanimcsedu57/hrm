"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, ArrowLeft, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react"

interface UserData {
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
}

export default function UserDetailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const loggedIn = localStorage.getItem("hrm_admin_logged_in")
    if (loggedIn !== "true") {
      router.push("/")
      return
    }

    setIsAuthenticated(true)

    // Load user data
    const users = JSON.parse(localStorage.getItem("hrm_users") || "[]")
    const userData = users.find((u: UserData) => u.id === params.id)

    if (userData) {
      setUser(userData)
    } else {
      router.push("/users")
    }
    setLoading(false)
  }, [router, params.id])

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>User not found</p>
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
              <Button variant="ghost" onClick={() => router.push("/users")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
              <div className="flex items-center space-x-4">
                <User className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h1>
              </div>
            </div>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                </div>
                <CardDescription>{user.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    {user.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {user.department && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Department</p>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Joined</p>
                        <p className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  Send Message
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  View Performance
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Manage Permissions
                </Button>
                <Button variant="destructive" className="w-full">
                  Deactivate User
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Account Status:</span>
                    <span className="font-medium capitalize">{user.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role:</span>
                    <span className="font-medium">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span className="font-medium">{user.department || "Not assigned"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
