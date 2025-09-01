"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ArrowLeft, Plus, Layers } from "lucide-react"

interface Division {
  id: string
  name: string
  description: string
  createdAt: string
}

interface Department {
  id: string
  name: string
  description: string
  createdAt: string
  divisions: Division[]
}

export default function DepartmentDetailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [department, setDepartment] = useState<Department | null>(null)
  const [branchName, setBranchName] = useState("")
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

    // Load department data
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const org = organizations.find((o: any) => o.id === params.id)

    if (org) {
      setOrganizationName(org.name)
      const company = org.companies?.find((c: any) => c.id === params.companyId)
      if (company) {
        setCompanyName(company.name)
        const branch = company.branches?.find((b: any) => b.id === params.branchId)
        if (branch) {
          setBranchName(branch.name)
          const deptData = branch.departments?.find((d: any) => d.id === params.departmentId)
          if (deptData) {
            // Ensure divisions array exists
            if (!deptData.divisions) {
              deptData.divisions = []
            }
            setDepartment(deptData)
          } else {
            router.push(`/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}`)
          }
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
  }, [router, params.id, params.companyId, params.branchId, params.departmentId])

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Department not found</p>
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
                onClick={() =>
                  router.push(`/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}`)
                }
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {branchName}
              </Button>
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{department.name}</h1>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${department.id}/divisions/create`,
                )
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Division
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Department Details</CardTitle>
            <CardDescription>
              {organizationName} → {companyName} → {branchName} → {department.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="text-muted-foreground">{department.description || "No description provided"}</p>
              <p className="text-muted-foreground mt-2">
                Created {new Date(department.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Divisions Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Divisions</h2>

          {department.divisions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Divisions Found</CardTitle>
                <CardDescription className="mb-4">
                  Add your first division to organize this department's work.
                </CardDescription>
                <Button
                  onClick={() =>
                    router.push(
                      `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${department.id}/divisions/create`,
                    )
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Division
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {department.divisions.map((division) => (
                <Card key={division.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Layers className="h-5 w-5 text-primary" />
                      <span>{division.name}</span>
                    </CardTitle>
                    <CardDescription>{division.description || "No description provided"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      <span>Created {new Date(division.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() =>
                        router.push(
                          `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${department.id}/divisions/${division.id}`,
                        )
                      }
                    >
                      Manage Division
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
