"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, ArrowLeft, Plus, MapPin, Users } from "lucide-react"

interface Department {
  id: string
  name: string
  description: string
  createdAt: string
  divisions: Division[]
}

interface Division {
  id: string
  name: string
  description: string
  createdAt: string
}

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  createdAt: string
  departments: Department[]
}

export default function BranchDetailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [branch, setBranch] = useState<Branch | null>(null)
  const [companyName, setCompanyName] = useState("")
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

    // Load branch data
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const org = organizations.find((o: any) => o.id === params.id)

    if (org) {
      setOrganizationName(org.name)
      const company = org.companies?.find((c: any) => c.id === params.companyId)
      if (company) {
        setCompanyName(company.name)
        const branchData = company.branches?.find((b: any) => b.id === params.branchId)
        if (branchData) {
          // Ensure departments array exists
          if (!branchData.departments) {
            branchData.departments = []
          }
          setBranch(branchData)
        } else {
          router.push(`/organizations/${params.id}/companies/${params.companyId}`)
        }
      } else {
        router.push(`/organizations/${params.id}`)
      }
    } else {
      router.push("/organizations")
    }
    setLoading(false)
  }, [router, params.id, params.companyId, params.branchId])

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Branch not found</p>
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
              <Button
                variant="ghost"
                onClick={() => router.push(`/organizations/${params.id}/companies/${params.companyId}`)}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {companyName}
              </Button>
              <div className="flex items-center space-x-4">
                <Building className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{branch.name}</h1>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/organizations/${params.id}/companies/${params.companyId}/branches/${branch.id}/departments/create`,
                )
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Branch Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Branch Details</CardTitle>
            <CardDescription>
              {organizationName} → {companyName} → {branch.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {branch.email && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Email:</span>
                  <span>{branch.email}</span>
                </div>
              )}
              {branch.phone && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Phone:</span>
                  <span>{branch.phone}</span>
                </div>
              )}
              {branch.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{branch.address}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Departments Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Departments</h2>

          {branch.departments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Departments Found</CardTitle>
                <CardDescription className="mb-4">
                  Add your first department to organize this branch's operations.
                </CardDescription>
                <Button
                  onClick={() =>
                    router.push(
                      `/organizations/${params.id}/companies/${params.companyId}/branches/${branch.id}/departments/create`,
                    )
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Department
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branch.departments.map((department) => (
                <Card key={department.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>{department.name}</span>
                    </CardTitle>
                    <CardDescription>{department.description || "No description provided"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{department.divisions?.length || 0} Divisions</span>
                      </div>
                      <span>Created {new Date(department.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() =>
                        router.push(
                          `/organizations/${params.id}/companies/${params.companyId}/branches/${branch.id}/departments/${department.id}`,
                        )
                      }
                    >
                      Manage Department
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
