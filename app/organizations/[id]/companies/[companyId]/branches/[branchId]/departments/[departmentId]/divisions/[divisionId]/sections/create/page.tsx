"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Grid3X3, ArrowLeft } from "lucide-react"

export default function CreateSectionPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [divisionName, setDivisionName] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const loggedIn = localStorage.getItem("hrm_admin_logged_in")
    if (loggedIn !== "true") {
      router.push("/")
      return
    }

    setIsAuthenticated(true)

    // Load division name
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const org = organizations.find((o: any) => o.id === params.id)
    if (org) {
      const company = org.companies?.find((c: any) => c.id === params.companyId)
      if (company) {
        const branch = company.branches?.find((b: any) => b.id === params.branchId)
        if (branch) {
          const department = branch.departments?.find((d: any) => d.id === params.departmentId)
          if (department) {
            const division = department.divisions?.find((div: any) => div.id === params.divisionId)
            if (division) {
              setDivisionName(division.name)
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
  }, [router, params.id, params.companyId, params.branchId, params.departmentId, params.divisionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update division with new section
      const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      const orgIndex = organizations.findIndex((o: any) => o.id === params.id)

      if (orgIndex !== -1) {
        const companyIndex = organizations[orgIndex].companies.findIndex((c: any) => c.id === params.companyId)

        if (companyIndex !== -1) {
          const branchIndex = organizations[orgIndex].companies[companyIndex].branches.findIndex(
            (b: any) => b.id === params.branchId,
          )

          if (branchIndex !== -1) {
            const departmentIndex = organizations[orgIndex].companies[companyIndex].branches[
              branchIndex
            ].departments.findIndex((d: any) => d.id === params.departmentId)

            if (departmentIndex !== -1) {
              const divisionIndex = organizations[orgIndex].companies[companyIndex].branches[branchIndex].departments[
                departmentIndex
              ].divisions.findIndex((div: any) => div.id === params.divisionId)

              if (divisionIndex !== -1) {
                const newSection = {
                  id: Date.now().toString(),
                  ...formData,
                  createdAt: new Date().toISOString(),
                  subSections: [],
                }

                if (
                  !organizations[orgIndex].companies[companyIndex].branches[branchIndex].departments[departmentIndex]
                    .divisions[divisionIndex].sections
                ) {
                  organizations[orgIndex].companies[companyIndex].branches[branchIndex].departments[
                    departmentIndex
                  ].divisions[divisionIndex].sections = []
                }
                organizations[orgIndex].companies[companyIndex].branches[branchIndex].departments[
                  departmentIndex
                ].divisions[divisionIndex].sections.push(newSection)
                localStorage.setItem("hrm_organizations", JSON.stringify(organizations))
              }
            }
          }
        }
      }

      setIsLoading(false)
      router.push(
        `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${params.divisionId}`,
      )
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

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
          <div className="flex items-center h-16">
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
              <h1 className="text-xl font-bold text-foreground">Create Section</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">New Section</CardTitle>
            <CardDescription>Add a new section to {divisionName}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Section Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter section name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the section"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating..." : "Create Section"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}/divisions/${params.divisionId}`,
                    )
                  }
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
