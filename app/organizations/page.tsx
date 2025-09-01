"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowLeft, Plus, MapPin, Briefcase } from "lucide-react"

interface Organization {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  createdAt: string
  companies: any[]
}

export default function OrganizationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("hrm_admin_logged_in")
    if (loggedIn !== "true") {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      // Load organizations from localStorage
      const storedOrgs = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      setOrganizations(storedOrgs)
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
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Organizations</h1>
              </div>
            </div>
            <Button onClick={() => router.push("/organizations/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {organizations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="mb-2">No Organizations Found</CardTitle>
              <CardDescription className="mb-4">
                Get started by creating your first organization to manage companies and employees.
              </CardDescription>
              <Button onClick={() => router.push("/organizations/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Organization
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span>{org.name}</span>
                  </CardTitle>
                  <CardDescription>{org.description || "No description provided"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {org.email && (
                      <div className="flex items-center space-x-2">
                        <span>📧</span>
                        <span>{org.email}</span>
                      </div>
                    )}
                    {org.phone && (
                      <div className="flex items-center space-x-2">
                        <span>📞</span>
                        <span>{org.phone}</span>
                      </div>
                    )}
                    {org.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{org.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{org.companies?.length || 0} Companies</span>
                      </div>
                    </div>
                    <span>Created {new Date(org.createdAt).toLocaleDateString()}</span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => router.push(`/organizations/${org.id}`)}
                  >
                    Manage Organization
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
