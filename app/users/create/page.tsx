"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, ArrowLeft, X } from "lucide-react"
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
  branchIds: string[] // Added branchIds field to assignment interface
  departmentIds: string[]
  divisionIds: string[]
  sectionIds: string[]
  subsectionIds: string[]
}

export default function CreateUserPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [organizationalData, setOrganizationalData] = useState<any>({})
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
      branchIds: [] as string[], // Added branchIds to form data
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
      const storedOrgs = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      setOrganizations(storedOrgs)

      const storedDesignations = JSON.parse(localStorage.getItem("hrm_designations") || "[]")
      setDesignations(storedDesignations)

      loadOrganizationalData()

      console.log("[v0] All localStorage keys:", Object.keys(localStorage))
      console.log(
        "[v0] Keys containing 'hrm_companies':",
        Object.keys(localStorage).filter((key) => key.includes("hrm_companies")),
      )
    }
  }, [router])

  const loadOrganizationalData = () => {
    console.log("[v0] Loading organizational data...")
    const data: any = {}

    const orgs = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    console.log("[v0] Found organizations:", orgs)

    orgs.forEach((org: any) => {
      console.log("[v0] Processing organization:", org.name, org.id)

      const companies = org.companies || []
      console.log("[v0] Companies from nested structure:", companies)

      data[org.id] = {
        organization: org,
        companies: companies,
        branches: {},
        departments: {},
        divisions: {},
        sections: {},
        subsections: {},
      }

      companies.forEach((company: any) => {
        const branches = company.branches || []
        data[org.id].branches[company.id] = branches

        branches.forEach((branch: any) => {
          const departments = branch.departments || []
          data[org.id].departments[branch.id] = departments

          departments.forEach((dept: any) => {
            const divisions = dept.divisions || []
            data[org.id].divisions[dept.id] = divisions

            divisions.forEach((division: any) => {
              const sections = division.sections || []
              data[org.id].sections[division.id] = sections

              sections.forEach((section: any) => {
                const subsections = section.subsections || []
                data[org.id].subsections[section.id] = subsections
              })
            })
          })
        })
      })
    })

    console.log("[v0] Final organizational data structure:", data)
    setOrganizationalData(data)
  }

  const getAvailableCompanies = () => {
    if (!formData.assignment.organizationId || !organizationalData[formData.assignment.organizationId]) {
      console.log("[v0] No organization selected or no data for organization:", formData.assignment.organizationId)
      return []
    }

    const companies = organizationalData[formData.assignment.organizationId].companies || []
    console.log("[v0] Available companies for organization:", formData.assignment.organizationId, companies)
    return companies
  }

  const getAvailableBranches = () => {
    if (!formData.assignment.organizationId || formData.assignment.companyIds.length === 0) {
      return []
    }

    const branches: any[] = []
    formData.assignment.companyIds.forEach((companyId) => {
      const companyBranches = organizationalData[formData.assignment.organizationId].branches[companyId] || []
      branches.push(...companyBranches)
    })

    return branches.filter((branch, index, self) => index === self.findIndex((b) => b.id === branch.id))
  }

  const getAvailableDepartments = () => {
    if (!formData.assignment.organizationId || formData.assignment.branchIds.length === 0) {
      return []
    }

    const departments: any[] = []
    formData.assignment.branchIds.forEach((branchId) => {
      const branchDepartments = organizationalData[formData.assignment.organizationId].departments[branchId] || []
      departments.push(...branchDepartments)
    })

    return departments.filter((dept, index, self) => index === self.findIndex((d) => d.id === dept.id))
  }

  const getAvailableDivisions = () => {
    if (formData.assignment.departmentIds.length === 0) {
      return []
    }

    const divisions: any[] = []
    formData.assignment.departmentIds.forEach((deptId) => {
      const deptDivisions = organizationalData[formData.assignment.organizationId].divisions[deptId] || []
      divisions.push(...deptDivisions)
    })

    return divisions.filter((div, index, self) => index === self.findIndex((d) => d.id === div.id))
  }

  const getAvailableSections = () => {
    if (formData.assignment.divisionIds.length === 0) {
      return []
    }

    const sections: any[] = []
    formData.assignment.divisionIds.forEach((divisionId) => {
      const divisionSections = organizationalData[formData.assignment.organizationId].sections[divisionId] || []
      sections.push(...divisionSections)
    })

    return sections.filter((section, index, self) => index === self.findIndex((s) => s.id === section.id))
  }

  const getAvailableSubsections = () => {
    if (formData.assignment.sectionIds.length === 0) {
      return []
    }

    const subsections: any[] = []
    formData.assignment.sectionIds.forEach((sectionId) => {
      const sectionSubsections = organizationalData[formData.assignment.organizationId].subsections[sectionId] || []
      subsections.push(...sectionSubsections)
    })

    return subsections.filter((subsection, index, self) => index === self.findIndex((s) => s.id === subsection.id))
  }

  const handleAssignmentChange = (field: keyof OrganizationalAssignment, value: string | string[]) => {
    setFormData((prev) => {
      const newAssignment = { ...prev.assignment, [field]: value }

      if (field === "organizationId") {
        newAssignment.companyIds = []
        newAssignment.branchIds = [] // Clear branchIds when organization changes
        newAssignment.departmentIds = []
        newAssignment.divisionIds = []
        newAssignment.sectionIds = []
        newAssignment.subsectionIds = []
      } else if (field === "companyIds") {
        newAssignment.branchIds = [] // Clear branchIds when companies change
        newAssignment.departmentIds = []
        newAssignment.divisionIds = []
        newAssignment.sectionIds = []
        newAssignment.subsectionIds = []
      } else if (field === "branchIds") {
        // Added branchIds handling
        newAssignment.departmentIds = []
        newAssignment.divisionIds = []
        newAssignment.sectionIds = []
        newAssignment.subsectionIds = []
      } else if (field === "departmentIds") {
        newAssignment.divisionIds = []
        newAssignment.sectionIds = []
        newAssignment.subsectionIds = []
      } else if (field === "divisionIds") {
        newAssignment.sectionIds = []
        newAssignment.subsectionIds = []
      } else if (field === "sectionIds") {
        newAssignment.subsectionIds = []
      }

      return {
        ...prev,
        assignment: newAssignment,
      }
    })
  }

  const addToSelection = (field: keyof OrganizationalAssignment, id: string) => {
    const currentIds = formData.assignment[field] as string[]
    if (!currentIds.includes(id)) {
      handleAssignmentChange(field, [...currentIds, id])
    }
  }

  const removeFromSelection = (field: keyof OrganizationalAssignment, id: string) => {
    const currentIds = formData.assignment[field] as string[]
    handleAssignmentChange(
      field,
      currentIds.filter((existingId) => existingId !== id),
    )
  }

  const getSelectedItemName = (items: any[], id: string) => {
    const item = items.find((item) => item.id === id)
    return item ? item.name : id
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Companies (Multiple)</Label>
                          <Select onValueChange={(value) => addToSelection("companyIds", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select companies" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableCompanies()
                                .filter((company) => !formData.assignment.companyIds.includes(company.id))
                                .map((company) => (
                                  <SelectItem key={company.id} value={company.id}>
                                    {company.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          {formData.assignment.companyIds.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {formData.assignment.companyIds.map((companyId) => (
                                <Badge key={companyId} variant="secondary" className="text-xs">
                                  {getSelectedItemName(getAvailableCompanies(), companyId)}
                                  <X
                                    className="h-3 w-3 ml-1 cursor-pointer"
                                    onClick={() => removeFromSelection("companyIds", companyId)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {formData.assignment.companyIds.length > 0 && (
                          <>
                            <div className="space-y-2">
                              <Label>Branches (Multiple)</Label>
                              <Select onValueChange={(value) => addToSelection("branchIds", value)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select branches" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableBranches()
                                    .filter((branch) => !formData.assignment.branchIds.includes(branch.id))
                                    .map((branch) => (
                                      <SelectItem key={branch.id} value={branch.id}>
                                        {branch.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              {formData.assignment.branchIds.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {formData.assignment.branchIds.map((branchId) => (
                                    <Badge key={branchId} variant="secondary" className="text-xs">
                                      {getSelectedItemName(getAvailableBranches(), branchId)}
                                      <X
                                        className="h-3 w-3 ml-1 cursor-pointer"
                                        onClick={() => removeFromSelection("branchIds", branchId)}
                                      />
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            {formData.assignment.branchIds.length > 0 && (
                              <div className="space-y-2">
                                <Label>Departments (Multiple)</Label>
                                <Select onValueChange={(value) => addToSelection("departmentIds", value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select departments" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getAvailableDepartments()
                                      .filter((dept) => !formData.assignment.departmentIds.includes(dept.id))
                                      .map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                          {dept.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                {formData.assignment.departmentIds.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {formData.assignment.departmentIds.map((deptId) => (
                                      <Badge key={deptId} variant="secondary" className="text-xs">
                                        {getSelectedItemName(getAvailableDepartments(), deptId)}
                                        <X
                                          className="h-3 w-3 ml-1 cursor-pointer"
                                          onClick={() => removeFromSelection("departmentIds", deptId)}
                                        />
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}

                        {formData.assignment.departmentIds.length > 0 && (
                          <div className="space-y-2">
                            <Label>Divisions (Multiple)</Label>
                            <Select onValueChange={(value) => addToSelection("divisionIds", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select divisions" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableDivisions()
                                  .filter((div) => !formData.assignment.divisionIds.includes(div.id))
                                  .map((div) => (
                                    <SelectItem key={div.id} value={div.id}>
                                      {div.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {formData.assignment.divisionIds.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {formData.assignment.divisionIds.map((divId) => (
                                  <Badge key={divId} variant="secondary" className="text-xs">
                                    {getSelectedItemName(getAvailableDivisions(), divId)}
                                    <X
                                      className="h-3 w-3 ml-1 cursor-pointer"
                                      onClick={() => removeFromSelection("divisionIds", divId)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {formData.assignment.divisionIds.length > 0 && (
                          <div className="space-y-2">
                            <Label>Sections (Multiple)</Label>
                            <Select onValueChange={(value) => addToSelection("sectionIds", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sections" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableSections()
                                  .filter((section) => !formData.assignment.sectionIds.includes(section.id))
                                  .map((section) => (
                                    <SelectItem key={section.id} value={section.id}>
                                      {section.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {formData.assignment.sectionIds.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {formData.assignment.sectionIds.map((sectionId) => (
                                  <Badge key={sectionId} variant="secondary" className="text-xs">
                                    {getSelectedItemName(getAvailableSections(), sectionId)}
                                    <X
                                      className="h-3 w-3 ml-1 cursor-pointer"
                                      onClick={() => removeFromSelection("sectionIds", sectionId)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {formData.assignment.sectionIds.length > 0 && (
                          <div className="space-y-2">
                            <Label>Sub-sections (Multiple)</Label>
                            <Select onValueChange={(value) => addToSelection("subsectionIds", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sub-sections" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableSubsections()
                                  .filter((subsection) => !formData.assignment.subsectionIds.includes(subsection.id))
                                  .map((subsection) => (
                                    <SelectItem key={subsection.id} value={subsection.id}>
                                      {subsection.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {formData.assignment.subsectionIds.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {formData.assignment.subsectionIds.map((subsectionId) => (
                                  <Badge key={subsectionId} variant="secondary" className="text-xs">
                                    {getSelectedItemName(getAvailableSubsections(), subsectionId)}
                                    <X
                                      className="h-3 w-3 ml-1 cursor-pointer"
                                      onClick={() => removeFromSelection("subsectionIds", subsectionId)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {(formData.assignment.companyIds.length > 0 ||
                        formData.assignment.branchIds.length > 0 || // Added branchIds to summary condition
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
                            {formData.assignment.branchIds.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {formData.assignment.branchIds.length} Branches
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
