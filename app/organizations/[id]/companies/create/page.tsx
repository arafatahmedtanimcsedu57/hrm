"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, ArrowLeft } from "lucide-react"

export default function CreateCompanyPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [organizationName, setOrganizationName] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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

    // Load organization name
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const org = organizations.find((o: any) => o.id === params.id)
    if (org) {
      setOrganizationName(org.name)
    } else {
      router.push("/organizations")
    }
  }, [router, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update organization with new company
      const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
      const orgIndex = organizations.findIndex((o: any) => o.id === params.id)

      if (orgIndex !== -1) {
        const newCompany = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          branches: [],
        }

        if (!organizations[orgIndex].companies) {
          organizations[orgIndex].companies = []
        }
        organizations[orgIndex].companies.push(newCompany)
        localStorage.setItem("hrm_organizations", JSON.stringify(organizations))
      }

      setIsLoading(false)
      router.push(`/organizations/${params.id}`)
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
            <Button variant="ghost" onClick={() => router.push(`/organizations/${params.id}`)} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {organizationName}
            </Button>
            <div className="flex items-center space-x-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Create Company</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">New Company</CardTitle>
            <CardDescription>Add a new company to {organizationName}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter company name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the company"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Company address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
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
                  {isLoading ? "Creating..." : "Create Company"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/organizations/${params.id}`)}
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
