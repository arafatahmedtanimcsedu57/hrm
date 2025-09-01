"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, ArrowLeft, Plus, X } from "lucide-react"
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
    assignments: [] as OrganizationalAssignment[],
    status: "active" as "active" | "inactive",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [currentAssignment, setCurrentAssignment] = useState<Partial<OrganizationalAssignment>>({})
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

  const addAssignment = () => {
    if (currentAssignment.organizationId && currentAssignment.organizationName) {
      const newAssignment: OrganizationalAssignment = {
        organizationId: currentAssignment.organizationId,
        organizationName: currentAssignment.organizationName,
        companyIds: currentAssignment.companyIds || [],
        departmentIds: currentAssignment.departmentIds || [],
        divisionIds: currentAssignment.divisionIds || [],
        sectionIds: currentAssignment.sectionIds || [],
        subsectionIds: currentAssignment.subsectionIds || [],
      }

      setFormData((prev) => ({
        ...prev,
        assignments: [...prev.assignments, newAssignment],
      }))

      setCurrentAssignment({})
    }
  }

  const removeAssignment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index),
    }))
  }

  const handleAssignmentChange = (field: keyof OrganizationalAssignment, value: string | string[]) => {
    setCurrentAssignment((prev) => ({
      ...prev,
      [field]: value,
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
            <CardDescription>Add a new employee with multiple organizational assignments</CardDescription>
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
                  <Label className="text-lg font-semibold">Organizational Assignments</Label>
                  <p className="text-sm text-muted-foreground">
                    Employee can be assigned to multiple organizational units
                  </p>
                </div>

                {/* Current Assignments */}
                {formData.assignments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Current Assignments:</Label>
                    <div className="space-y-2">
                      {formData.assignments.map((assignment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{assignment.organizationName}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {assignment.companyIds.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {assignment.companyIds.length} Companies
                                </Badge>
                              )}
                              {assignment.departmentIds.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {assignment.departmentIds.length} Departments
                                </Badge>
                              )}
                              {assignment.divisionIds.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {assignment.divisionIds.length} Divisions
                                </Badge>
                              )}
                              {assignment.sectionIds.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {assignment.sectionIds.length} Sections
                                </Badge>
                              )}
                              {assignment.subsectionIds.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {assignment.subsectionIds.length} Sub-sections
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAssignment(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Assignment */}
                <div className="border rounded-lg p-4 space-y-4">
                  <Label className="text-sm font-medium">Add New Assignment:</Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Organization *</Label>
                      <Select
                        onValueChange={(value) => {
                          const org = organizations.find((o) => o.id === value)
                          handleAssignmentChange("organizationId", value)
                          handleAssignmentChange("organizationName", org?.name || "")
                        }}
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

                    <div className="space-y-2">
                      <Label>Companies (Multiple)</Label>
                      <Input
                        placeholder="Enter company IDs (comma-separated)"
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Departments (Multiple)</Label>
                      <Input
                        placeholder="Enter department IDs (comma-separated)"
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

                    <div className="space-y-2">
                      <Label>Divisions (Multiple)</Label>
                      <Input
                        placeholder="Enter division IDs (comma-separated)"
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sections (Multiple)</Label>
                      <Input
                        placeholder="Enter section IDs (comma-separated)"
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

                    <div className="space-y-2">
                      <Label>Sub-sections (Multiple)</Label>
                      <Input
                        placeholder="Enter sub-section IDs (comma-separated)"
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
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addAssignment}
                    disabled={!currentAssignment.organizationId}
                    className="w-full bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Assignment
                  </Button>
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
