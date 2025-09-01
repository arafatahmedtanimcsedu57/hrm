"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Designation {
  id: string
  name: string
  description?: string
  level: number
  createdAt: string
}

interface OrganizationalAssignment {
  organizationId: string
  organizationName: string
  companyIds: string[]
  departmentIds: string[]
  divisionIds: string[]
  sectionIds: string[]
  subsectionIds: string[]
}

export default function CreateUserPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    assignment: {
      organizationId: "",
      organizationName: "",
      companyIds: [] as string[],
      departmentIds: [] as string[],
      divisionIds: [] as string[],
      sectionIds: [] as string[],
      subsectionIds: [] as string[],
    } as OrganizationalAssignment,
    status: "active" as "active" | "inactive",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("hrm_admin_logged_in")
    if (loggedIn !== "true") {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      // Load organizations for assignment
      const storedOrgs = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      setOrganizations(storedOrgs)

      const storedDesignations = JSON.parse(localStorage.getItem("hrm_designations") || "[]")
      setDesignations(storedDesignations)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Create new user
      const users = JSON.parse(localStorage.getItem("hrm_users") || "[]")
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      users.push(newUser)
      localStorage.setItem("hrm_users", JSON.stringify(users))

      setIsLoading(false)
      router.push("/users")
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAssignmentChange = (field: keyof OrganizationalAssignment, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      assignment: {
        ...prev.assignment,
        [field]: value,
      },
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
            <Button variant="ghost" onClick={() => router.push("/users")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <div className="flex items-center space-x-4">
              <UserPlus className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Add New User</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">New Employee</CardTitle>
            <CardDescription>
              Add a new employee to a single organization with multiple internal assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="employee@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Select onValueChange={(value) => handleSelectChange("designation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.length > 0 ? (
                        designations
                          .sort((a, b) => b.level - a.level)
                          .map((designation) => (
                            <SelectItem key={designation.id} value={designation.name}>
                              {designation.name} {designation.description && `- ${designation.description}`}
                            </SelectItem>
                          ))
                      ) : (
                        <>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Team Lead">Team Lead</SelectItem>
                          <SelectItem value="Senior Employee">Senior Employee</SelectItem>
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Intern">Intern</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => handleSelectChange("status", value)} defaultValue="active">
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Organizational Assignment</Label>
                  <p className="text-sm text-muted-foreground">
                    Employee belongs to one organization with multiple internal assignments
                  </p>
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Organization *</Label>
                    <Select
                      onValueChange={(value) => {
                        const org = organizations.find((o) => o.id === value)
                        handleAssignmentChange("organizationId", value)
                        handleAssignmentChange("organizationName", org?.name || "")
                      }}
                      value={formData.assignment.organizationId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.assignment.organizationId && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Companies (Multiple)</Label>
                          <Input
                            placeholder="Enter company IDs (comma-separated)"
                            value={formData.assignment.companyIds.join(", ")}
                            onChange={(e) =>
                              handleAssignmentChange(
                                "companyIds",
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Departments (Multiple)</Label>
                          <Input
                            placeholder="Enter department IDs (comma-separated)"
                            value={formData.assignment.departmentIds.join(", ")}
                            onChange={(e) =>
                              handleAssignmentChange(
                                "departmentIds",
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Divisions (Multiple)</Label>
                          <Input
                            placeholder="Enter division IDs (comma-separated)"
                            value={formData.assignment.divisionIds.join(", ")}
                            onChange={(e) =>
                              handleAssignmentChange(
                                "divisionIds",
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Sections (Multiple)</Label>
                          <Input
                            placeholder="Enter section IDs (comma-separated)"
                            value={formData.assignment.sectionIds.join(", ")}
                            onChange={(e) =>
                              handleAssignmentChange(
                                "sectionIds",
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Sub-sections (Multiple)</Label>
                        <Input
                          placeholder="Enter sub-section IDs (comma-separated)"
                          value={formData.assignment.subsectionIds.join(", ")}
                          onChange={(e) =>
                            handleAssignmentChange(
                              "subsectionIds",
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            )
                          }
                        />
                      </div>

                      {/* Assignment Summary */}
                      {(formData.assignment.companyIds.length > 0 ||
                        formData.assignment.departmentIds.length > 0 ||
                        formData.assignment.divisionIds.length > 0 ||
                        formData.assignment.sectionIds.length > 0 ||
                        formData.assignment.subsectionIds.length > 0) && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <Label className="text-sm font-medium">Assignment Summary:</Label>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {formData.assignment.companyIds.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {formData.assignment.companyIds.length} Companies
                              </Badge>
                            )}
                            {formData.assignment.departmentIds.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {formData.assignment.departmentIds.length} Departments
                              </Badge>
                            )}
                            {formData.assignment.divisionIds.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {formData.assignment.divisionIds.length} Divisions
                              </Badge>
                            )}
                            {formData.assignment.sectionIds.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {formData.assignment.sectionIds.length} Sections
                              </Badge>
                            )}
                            {formData.assignment.subsectionIds.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {formData.assignment.subsectionIds.length} Sub-sections
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating..." : "Create User"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/users")} className="flex-1">
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
