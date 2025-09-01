"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Grid3X3, ArrowLeft, Plus, Square } from "lucide-react"

interface SubSection {
  id: string
  name: string
  description: string
  createdAt: string
}

interface Section {
  id: string
  name: string
  description: string
  createdAt: string
  subSections: SubSection[]
}

export default function SectionDetailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [section, setSection] = useState<Section | null>(null)
  const [divisionName, setDivisionName] = useState("")
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

    // Load section data
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
            const division = department.divisions?.find((div: any) => div.id === params.divisionId)
            if (division) {
              setDivisionName(division.name)
              const sectionData = division.sections?.find((s: any) => s.id === params.sectionId)
              if (sectionData) {
                // Ensure subSections array exists
                if (!sectionData.subSections) {
                  sectionData.subSections = []
                }
                setSection(sectionData)
              } else {
                router.push(
                  `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${params.divisionId}`,
                )
              }
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
  }, [router, params.id, params.companyId, params.branchId, params.departmentId, params.divisionId, params.sectionId])

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!section) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Section not found</p>
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
                    `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${params.divisionId}`,
                  )
                }
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {divisionName}
              </Button>
              <div className="flex items-center space-x-4">
                <Grid3X3 className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{section.name}</h1>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${params.divisionId}/sections/${section.id}/sub-sections/create`,
                )
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-section
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Section Details</CardTitle>
            <CardDescription>
              {organizationName} → {companyName} → {branchName} → {departmentName} → {divisionName} → {section.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="text-muted-foreground">{section.description || "No description provided"}</p>
              <p className="text-muted-foreground mt-2">Created {new Date(section.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sub-sections Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sub-sections</h2>

          {section.subSections.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Square className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Sub-sections Found</CardTitle>
                <CardDescription className="mb-4">
                  Add your first sub-section to further organize this section's work.
                </CardDescription>
                <Button
                  onClick={() =>
                    router.push(
                      `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${params.divisionId}/sections/${section.id}/sub-sections/create`,
                    )
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Sub-section
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.subSections.map((subSection) => (
                <Card key={subSection.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Square className="h-5 w-5 text-primary" />
                      <span>{subSection.name}</span>
                    </CardTitle>
                    <CardDescription>{subSection.description || "No description provided"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      <span>Created {new Date(subSection.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent" disabled>
                      Sub-section Details
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
