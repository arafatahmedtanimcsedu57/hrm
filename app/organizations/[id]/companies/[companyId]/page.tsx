"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, ArrowLeft, Plus, MapPin, Building } from "lucide-react"

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  createdAt: string
}

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

export default function CompanyDetailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [organizationName, setOrganizationName] = useState("")
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

    // Load company data
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const org = organizations.find((o: any) => o.id === params.id)

    if (org) {
      setOrganizationName(org.name)
      const comp = org.companies?.find((c: Company) => c.id === params.companyId)
      if (comp) {
        setCompany(comp)
      } else {
        router.push(`/organizations/${params.id}`)
      }
    } else {
      router.push("/organizations")
    }
    setLoading(false)
  }, [router, params.id, params.companyId])

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Company not found</p>
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
              <Button variant="ghost" onClick={() => router.push(`/organizations/${params.id}`)} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {organizationName}
              </Button>
              <div className="flex items-center space-x-4">
                <Briefcase className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{company.name}</h1>
              </div>
            </div>
            <Button onClick={() => router.push(`/organizations/${params.id}/companies/${company.id}/branches/create`)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>{company.description || "No description provided"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {company.email && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Email:</span>
                  <span>{company.email}</span>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Phone:</span>
                  <span>{company.phone}</span>
                </div>
              )}
              {company.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{company.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Branches Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Branches</h2>

          {company.branches.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Branches Found</CardTitle>
                <CardDescription className="mb-4">
                  Add your first branch to expand this company's presence.
                </CardDescription>
                <Button
                  onClick={() => router.push(`/organizations/${params.id}/companies/${company.id}/branches/create`)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Branch
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {company.branches.map((branch) => (
                <Card key={branch.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-primary" />
                      <span>{branch.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      {branch.email && (
                        <div className="flex items-center space-x-2">
                          <span>📧</span>
                          <span>{branch.email}</span>
                        </div>
                      )}
                      {branch.phone && (
                        <div className="flex items-center space-x-2">
                          <span>📞</span>
                          <span>{branch.phone}</span>
                        </div>
                      )}
                      {branch.address && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{branch.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground mb-4">
                      <span>Created {new Date(branch.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() =>
                        router.push(`/organizations/${params.id}/companies/${company.id}/branches/${branch.id}`)
                      }
                    >
                      Manage Branch
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
