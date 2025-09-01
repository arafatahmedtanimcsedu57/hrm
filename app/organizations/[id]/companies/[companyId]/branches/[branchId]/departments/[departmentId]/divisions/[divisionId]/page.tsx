"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Layers, ArrowLeft, Plus, Grid3X3 } from "lucide-react"

interface Section {
  id: string
  name: string
  description: string
  createdAt: string
  subSections: SubSection[]
}

interface SubSection {
  id: string
  name: string
  description: string
  createdAt: string
}

interface Division {
  id: string
  name: string
  description: string
  createdAt: string
  sections: Section[]
}

export default function DivisionDetailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [division, setDivision] = useState<Division | null>(null)
  const [departmentName, setDepartmentName] = useState("")
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

    // Load division data
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
          const department = branch.departments?.find((d: any) => d.id === params.departmentId)
          if (department) {
            setDepartmentName(department.name)
            const divisionData = department.divisions?.find((div: any) => div.id === params.divisionId)
            if (divisionData) {
              // Ensure sections array exists
              if (!divisionData.sections) {
                divisionData.sections = []
              }
              setDivision(divisionData)
            } else {
              router.push(
                `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}`,
              )
            }
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
  }, [router, params.id, params.companyId, params.branchId, params.departmentId, params.divisionId])

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!division) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Division not found</p>
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
                  router.push(
                    `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}`,
                  )
                }
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {departmentName}
              </Button>
              <div className="flex items-center space-x-4">
                <Layers className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{division.name}</h1>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${division.id}/sections/create`,
                )
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Division Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Division Details</CardTitle>
            <CardDescription>
              {organizationName} → {companyName} → {branchName} → {departmentName} → {division.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="text-muted-foreground">{division.description || "No description provided"}</p>
              <p className="text-muted-foreground mt-2">Created {new Date(division.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sections Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sections</h2>

          {division.sections.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Sections Found</CardTitle>
                <CardDescription className="mb-4">
                  Add your first section to organize this division's activities.
                </CardDescription>
                <Button
                  onClick={() =>
                    router.push(
                      `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${division.id}/sections/create`,
                    )
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Section
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {division.sections.map((section) => (
                <Card key={section.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Grid3X3 className="h-5 w-5 text-primary" />
                      <span>{section.name}</span>
                    </CardTitle>
                    <CardDescription>{section.description || "No description provided"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Grid3X3 className="h-4 w-4" />
                        <span>{section.subSections?.length || 0} Sub-sections</span>
                      </div>
                      <span>Created {new Date(section.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() =>
                        router.push(
                          `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${division.id}/sections/${section.id}`,
                        )
                      }
                    >
                      Manage Section
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
