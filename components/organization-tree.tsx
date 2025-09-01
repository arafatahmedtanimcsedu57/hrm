"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Briefcase,
  Building,
  Users,
  Layers,
  Grid3X3,
  Square,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react"

interface TreeNode {
  id: string
  name: string
  description?: string
  type: "organization" | "company" | "branch" | "department" | "division" | "section" | "subsection"
  children?: TreeNode[]
  expanded?: boolean
  editing?: boolean
  [key: string]: any
}

interface OrganizationTreeProps {
  onRefresh?: () => void
}

export default function OrganizationTree({ onRefresh }: OrganizationTreeProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: "", description: "" })

  useEffect(() => {
    loadTreeData()
  }, [])

  const loadTreeData = () => {
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")
    const tree = organizations.map((org: any) => buildTreeNode(org, "organization"))
    setTreeData(tree)
  }

  const buildTreeNode = (data: any, type: string): TreeNode => {
    const node: TreeNode = {
      id: data.id,
      name: data.name,
      description: data.description,
      type: type as any,
      expanded: false,
      children: [],
    }

    switch (type) {
      case "organization":
        node.children = data.companies?.map((company: any) => buildTreeNode(company, "company")) || []
        break
      case "company":
        node.children = data.branches?.map((branch: any) => buildTreeNode(branch, "branch")) || []
        break
      case "branch":
        node.children = data.departments?.map((dept: any) => buildTreeNode(dept, "department")) || []
        break
      case "department":
        node.children = data.divisions?.map((div: any) => buildTreeNode(div, "division")) || []
        break
      case "division":
        node.children = data.sections?.map((section: any) => buildTreeNode(section, "section")) || []
        break
      case "section":
        node.children = data.subSections?.map((sub: any) => buildTreeNode(sub, "subsection")) || []
        break
    }

    return node
  }

  const getIcon = (type: string) => {
    const iconMap = {
      organization: Building2,
      company: Briefcase,
      branch: Building,
      department: Users,
      division: Layers,
      section: Grid3X3,
      subsection: Square,
    }
    const Icon = iconMap[type as keyof typeof iconMap]
    return <Icon className="h-4 w-4 text-primary" />
  }

  const toggleExpanded = (nodeId: string, path: number[] = []) => {
    setTreeData((prev) => {
      const newData = [...prev]
      let current = newData

      for (let i = 0; i < path.length; i++) {
        current = current[path[i]].children!
      }

      const nodeIndex = current.findIndex((node) => node.id === nodeId)
      if (nodeIndex !== -1) {
        current[nodeIndex].expanded = !current[nodeIndex].expanded
      }

      return newData
    })
  }

  const startEdit = (node: TreeNode) => {
    setEditingNode(node.id)
    setEditForm({ name: node.name, description: node.description || "" })
  }

  const cancelEdit = () => {
    setEditingNode(null)
    setEditForm({ name: "", description: "" })
  }

  const saveEdit = (nodeId: string, type: string) => {
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")

    const updateNodeInData = (data: any[], targetId: string, newData: any): boolean => {
      for (const item of data) {
        if (item.id === targetId) {
          item.name = newData.name
          item.description = newData.description
          return true
        }

        // Check nested structures
        const nestedArrays = ["companies", "branches", "departments", "divisions", "sections", "subSections"]
        for (const arrayName of nestedArrays) {
          if (item[arrayName] && updateNodeInData(item[arrayName], targetId, newData)) {
            return true
          }
        }
      }
      return false
    }

    updateNodeInData(organizations, nodeId, editForm)
    localStorage.setItem("hrm_organizations", JSON.stringify(organizations))

    loadTreeData()
    setEditingNode(null)
    setEditForm({ name: "", description: "" })
    onRefresh?.()
  }

  const deleteNode = (nodeId: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) {
      return
    }

    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")

    const deleteNodeFromData = (data: any[], targetId: string): boolean => {
      const index = data.findIndex((item) => item.id === targetId)
      if (index !== -1) {
        data.splice(index, 1)
        return true
      }

      // Check nested structures
      for (const item of data) {
        const nestedArrays = ["companies", "branches", "departments", "divisions", "sections", "subSections"]
        for (const arrayName of nestedArrays) {
          if (item[arrayName] && deleteNodeFromData(item[arrayName], targetId)) {
            return true
          }
        }
      }
      return false
    }

    deleteNodeFromData(organizations, nodeId)
    localStorage.setItem("hrm_organizations", JSON.stringify(organizations))

    loadTreeData()
    onRefresh?.()
  }

  const addChild = (parentId: string, parentType: string) => {
    const childTypeMap = {
      organization: "company",
      company: "branch",
      branch: "department",
      department: "division",
      division: "section",
      section: "subsection",
    }

    const childType = childTypeMap[parentType as keyof typeof childTypeMap]
    if (!childType) return

    const newChild = {
      id: Date.now().toString(),
      name: `New ${childType.charAt(0).toUpperCase() + childType.slice(1)}`,
      description: "",
      createdAt: new Date().toISOString(),
    }

    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")

    const addChildToData = (data: any[], targetId: string, child: any): boolean => {
      for (const item of data) {
        if (item.id === targetId) {
          const arrayMap = {
            organization: "companies",
            company: "branches",
            branch: "departments",
            department: "divisions",
            division: "sections",
            section: "subSections",
          }

          const arrayName = arrayMap[parentType as keyof typeof arrayMap]
          if (arrayName) {
            if (!item[arrayName]) item[arrayName] = []
            item[arrayName].push(child)
            return true
          }
        }

        // Check nested structures
        const nestedArrays = ["companies", "branches", "departments", "divisions", "sections", "subSections"]
        for (const arrayName of nestedArrays) {
          if (item[arrayName] && addChildToData(item[arrayName], targetId, child)) {
            return true
          }
        }
      }
      return false
    }

    addChildToData(organizations, parentId, newChild)
    localStorage.setItem("hrm_organizations", JSON.stringify(organizations))

    loadTreeData()
    onRefresh?.()
  }

  const renderTreeNode = (node: TreeNode, level = 0, path: number[] = []) => {
    const hasChildren = node.children && node.children.length > 0
    const isEditing = editingNode === node.id

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors ${
            level > 0 ? "ml-" + (level * 4) : ""
          }`}
          style={{ marginLeft: level * 16 }}
        >
          {/* Expand/Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => toggleExpanded(node.id, path)}
            disabled={!hasChildren}
          >
            {hasChildren ? (
              node.expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </Button>

          {/* Icon */}
          {getIcon(node.type)}

          {/* Node Content */}
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-8"
                placeholder="Name"
              />
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                className="h-8"
                placeholder="Description"
              />
              <Button size="sm" onClick={() => saveEdit(node.id, node.type)}>
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <div className="font-medium text-sm">{node.name}</div>
                {node.description && <div className="text-xs text-muted-foreground">{node.description}</div>}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {node.type !== "subsection" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addChild(node.id, node.type)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => startEdit(node)} className="h-6 w-6 p-0">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteNode(node.id, node.type)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Children */}
        {node.expanded && hasChildren && (
          <div className="group">
            {node.children!.map((child, index) => renderTreeNode(child, level + 1, [...path, index]))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Organization Structure</span>
          <Button onClick={loadTreeData} variant="outline" size="sm">
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {treeData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No organizations found. Create your first organization to get started.
          </div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {treeData.map((node, index) => renderTreeNode(node, 0, [index]))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
