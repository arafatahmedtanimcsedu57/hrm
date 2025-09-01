"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, ArrowLeft } from "lucide-react"

export default function CreateBranchPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
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

    // Load company name
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const org = organizations.find((o: any) => o.id === params.id)
    if (org) {
      const company = org.companies?.find((c: any) => c.id === params.companyId)
      if (company) {
        setCompanyName(company.name)
      } else {
        router.push(`/organizations/${params.id}`)
      }
    } else {
      router.push("/organizations")
    }
  }, [router, params.id, params.companyId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update company with new branch
      const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      const orgIndex = organizations.findIndex((o: any) => o.id === params.id)

      if (orgIndex !== -1) {
        const companyIndex = organizations[orgIndex].companies.findIndex((c: any) => c.id === params.companyId)

        if (companyIndex !== -1) {
          const newBranch = {
            id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString(),
          }

          if (!organizations[orgIndex].companies[companyIndex].branches) {
            organizations[orgIndex].companies[companyIndex].branches = []
          }
          organizations[orgIndex].companies[companyIndex].branches.push(newBranch)
          localStorage.setItem("hrm_organizations", JSON.stringify(organizations))
        }
      }

      setIsLoading(false)
      router.push(`/organizations/${params.id}/companies/${params.companyId}`)
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
              onClick={() => router.push(`/organizations/${params.id}/companies/${params.companyId}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {companyName}
            </Button>
            <div className="flex items-center space-x-4">
              <Building className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Create Branch</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">New Branch</CardTitle>
            <CardDescription>Add a new branch to {companyName}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Branch Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter branch name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="branch@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Branch address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
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

              <div className="flex space-x-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating..." : "Create Branch"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/organizations/${params.id}/companies/${params.companyId}`)}
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
