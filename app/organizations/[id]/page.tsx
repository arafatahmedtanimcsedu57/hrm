"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowLeft, Plus, MapPin, Briefcase } from "lucide-react"

interface Company {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  createdAt: string
  branches: Branch[]
}

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  createdAt: string
}

interface Organization {
  id: string
  name: string
  description: string
  address: string
  phone: string
  email: string
  createdAt: string
  companies: Company[]
}

export default function OrganizationDetailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [organization, setOrganization] = useState<Organization | null>(null)
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

    // Load organization data
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const org = organizations.find((o: Organization) => o.id === params.id)

    if (org) {
      setOrganization(org)
    } else {
      router.push("/organizations")
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

  if (!organization) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Organization not found</p>
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
              <Button variant="ghost" onClick={() => router.push("/organizations")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Organizations
              </Button>
              <div className="flex items-center space-x-4">
                <Building2 className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{organization.name}</h1>
              </div>
            </div>
            <Button onClick={() => router.push(`/organizations/${organization.id}/companies/create`)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Organization Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>{organization.description || "No description provided"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {organization.email && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Email:</span>
                  <span>{organization.email}</span>
                </div>
              )}
              {organization.phone && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Phone:</span>
                  <span>{organization.phone}</span>
                </div>
              )}
              {organization.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{organization.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Companies Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Companies</h2>

          {organization.companies.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Companies Found</CardTitle>
                <CardDescription className="mb-4">
                  Add your first company to start building your organizational structure.
                </CardDescription>
                <Button onClick={() => router.push(`/organizations/${organization.id}/companies/create`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Company
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organization.companies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <span>{company.name}</span>
                    </CardTitle>
                    <CardDescription>{company.description || "No description provided"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      {company.email && (
                        <div className="flex items-center space-x-2">
                          <span>📧</span>
                          <span>{company.email}</span>
                        </div>
                      )}
                      {company.phone && (
                        <div className="flex items-center space-x-2">
                          <span>📞</span>
                          <span>{company.phone}</span>
                        </div>
                      )}
                      {company.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{company.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{company.branches?.length || 0} Branches</span>
                      </div>
                      <span>Created {new Date(company.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push(`/organizations/${organization.id}/companies/${company.id}`)}
                    >
                      Manage Company
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
