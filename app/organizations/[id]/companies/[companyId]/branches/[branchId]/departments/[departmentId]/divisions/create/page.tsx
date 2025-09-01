"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Layers, ArrowLeft } from "lucide-react"

export default function CreateDivisionPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [departmentName, setDepartmentName] = useState("")
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

    // Load department name
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const org = organizations.find((o: any) => o.id === params.id)
    if (org) {
      const company = org.companies?.find((c: any) => c.id === params.companyId)
      if (company) {
        const branch = company.branches?.find((b: any) => b.id === params.branchId)
        if (branch) {
          const department = branch.departments?.find((d: any) => d.id === params.departmentId)
          if (department) {
            setDepartmentName(department.name)
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
  }, [router, params.id, params.companyId, params.branchId, params.departmentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update department with new division
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
              const newDivision = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date().toISOString(),
              }

              if (
                !organizations[orgIndex].companies[companyIndex].branches[branchIndex].departments[departmentIndex]
                  .divisions
              ) {
                organizations[orgIndex].companies[companyIndex].branches[branchIndex].departments[
                  departmentIndex
                ].divisions = []
              }
              organizations[orgIndex].companies[companyIndex].branches[branchIndex].departments[
                departmentIndex
              ].divisions.push(newDivision)
              localStorage.setItem("hrm_organizations", JSON.stringify(organizations))
            }
          }
        }
      }

      setIsLoading(false)
      router.push(
        `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}`,
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
              <h1 className="text-xl font-bold text-foreground">Create Division</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">New Division</CardTitle>
            <CardDescription>Add a new division to {departmentName}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Division Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter division name"
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
                  placeholder="Brief description of the division"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating..." : "Create Division"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/organizations/${params.id}/companies/${params.companyId}/branches/${params.branchId}/departments/${params.departmentId}`,
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
