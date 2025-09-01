"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowLeft, Briefcase, Edit, Trash2 } from "lucide-react"

interface Designation {
  id: string
  name: string
  description?: string
  level: number
  createdAt: string
}

export default function DesignationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [designations, setDesignations] = useState<Designation[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    level: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("hrm_admin_logged_in")
    if (loggedIn !== "true") {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      loadDesignations()
    }
  }, [router])

  const loadDesignations = () => {
    const stored = JSON.parse(localStorage.getItem("hrm_designations") || "[]")
    if (stored.length === 0) {
      // Initialize with default designations if none exist
      const defaultDesignations = [
        {
          id: "1",
          name: "Manager",
          description: "Team management and oversight",
          level: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Team Lead",
          description: "Lead a team of employees",
          level: 4,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Senior Employee",
          description: "Experienced team member",
          level: 3,
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Employee",
          description: "Regular team member",
          level: 2,
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Intern",
          description: "Learning and training position",
          level: 1,
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem("hrm_designations", JSON.stringify(defaultDesignations))
      setDesignations(defaultDesignations)
    } else {
      setDesignations(stored)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const newDesignation: Designation = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        level: formData.level,
        createdAt: new Date().toISOString(),
      }

      const updatedDesignations = [...designations, newDesignation]
      setDesignations(updatedDesignations)
      localStorage.setItem("hrm_designations", JSON.stringify(updatedDesignations))

      setFormData({ name: "", description: "", level: 1 })
      setShowCreateForm(false)
      setIsLoading(false)
    }, 500)
  }

  const handleDelete = (id: string) => {
    const updatedDesignations = designations.filter((d) => d.id !== id)
    setDesignations(updatedDesignations)
    localStorage.setItem("hrm_designations", JSON.stringify(updatedDesignations))
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-4">
                <Briefcase className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Designation Management</h1>
              </div>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Designation
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Designation</CardTitle>
              <CardDescription>Add a new designation to your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Designation Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Senior Developer"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level (1-10)</Label>
                    <Input
                      id="level"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.level}
                      onChange={(e) => setFormData((prev) => ({ ...prev, level: Number.parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the role"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Designation"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">All Designations</h2>
              <p className="text-muted-foreground">{designations.length} total designations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designations.map((designation) => (
              <Card key={designation.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{designation.name}</span>
                    <Badge variant="outline">Level {designation.level}</Badge>
                  </CardTitle>
                  {designation.description && <CardDescription>{designation.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground mb-4">
                    Created {new Date(designation.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(designation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
