"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
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
import type { JSX } from "react/jsx-runtime"

interface TreeNode {
  id: string
  name: string
  description?: string
  type: "organization" | "company" | "branch" | "department" | "division" | "section" | "subsection"
  children?: TreeNode[]
  x?: number
  y?: number
  editing?: boolean
}

interface VisualOrganizationTreeProps {
  onRefresh?: () => void
}

export default function VisualOrganizationTree({ onRefresh }: VisualOrganizationTreeProps) {
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
    return <Icon className="h-4 w-4" />
  }

  const getNodeColor = (type: string) => {
    const colorMap = {
      organization: "bg-primary text-primary-foreground",
      company: "bg-blue-500 text-white",
      branch: "bg-green-500 text-white",
      department: "bg-purple-500 text-white",
      division: "bg-orange-500 text-white",
      section: "bg-pink-500 text-white",
      subsection: "bg-yellow-500 text-black",
    }
    return colorMap[type as keyof typeof colorMap] || "bg-gray-500 text-white"
  }

  const calculatePositions = (nodes: TreeNode[], startX = 400, startY = 50, levelHeight = 120, nodeWidth = 160) => {
    if (nodes.length === 0) return []

    const positionedNodes: TreeNode[] = []

    const positionLevel = (levelNodes: TreeNode[], y: number, parentX?: number) => {
      const totalWidth = levelNodes.length * nodeWidth + (levelNodes.length - 1) * 40
      const startX = parentX !== undefined ? parentX - totalWidth / 2 : 400 - totalWidth / 2

      levelNodes.forEach((node, index) => {
        const x = startX + index * (nodeWidth + 40) + nodeWidth / 2
        const positionedNode = { ...node, x, y }
        positionedNodes.push(positionedNode)

        if (node.children && node.children.length > 0) {
          positionLevel(node.children, y + levelHeight, x)
        }
      })
    }

    positionLevel(nodes, startY)
    return positionedNodes
  }

  const startEdit = (node: TreeNode) => {
    setEditingNode(node.id)
    setEditForm({ name: node.name, description: node.description || "" })
  }

  const cancelEdit = () => {
    setEditingNode(null)
    setEditForm({ name: "", description: "" })
  }

  const saveEdit = (nodeId: string) => {
    const organizations = JSON.parse(localStorage.getItem("hrm_organizations") || "[]")

    const updateNodeInData = (data: any[], targetId: string, newData: any): boolean => {
      for (const item of data) {
        if (item.id === targetId) {
          item.name = newData.name
          item.description = newData.description
          return true
        }

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

  const renderConnections = (allNodes: TreeNode[]) => {
    const connections: JSX.Element[] = []

    const findChildren = (parentNode: TreeNode, allNodes: TreeNode[]) => {
      return allNodes.filter((node) => {
        // Find direct children by checking the original tree structure
        return parentNode.children?.some((child) => child.id === node.id)
      })
    }

    allNodes.forEach((parentNode) => {
      const children = findChildren(parentNode, allNodes)

      children.forEach((childNode) => {
        if (
          parentNode.x !== undefined &&
          parentNode.y !== undefined &&
          childNode.x !== undefined &&
          childNode.y !== undefined
        ) {
          const parentX = parentNode.x
          const parentY = parentNode.y + 30 // Bottom of parent node
          const childX = childNode.x
          const childY = childNode.y - 10 // Top of child node

          connections.push(
            <line
              key={`${parentNode.id}-${childNode.id}`}
              x1={parentX}
              y1={parentY}
              x2={childX}
              y2={childY}
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />,
          )
        }
      })
    })

    return connections
  }

  const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
    const flattened: TreeNode[] = []

    const traverse = (nodeList: TreeNode[]) => {
      nodeList.forEach((node) => {
        flattened.push(node)
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }

    traverse(nodes)
    return flattened
  }

  const allNodes = flattenTree(calculatePositions(treeData))
  const maxY = Math.max(...allNodes.map((node) => node.y || 0)) + 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Organization Tree View</span>
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
          <div className="w-full overflow-auto border rounded-lg bg-background">
            <svg width="800" height={maxY} className="min-w-full">
              {renderConnections(allNodes)}

              {allNodes.map((node) => {
                const isEditing = editingNode === node.id

                return (
                  <g key={node.id}>
                    {/* Node Background */}
                    <rect
                      x={(node.x || 0) - 75}
                      y={(node.y || 0) - 15}
                      width="150"
                      height="60"
                      rx="8"
                      className={`${getNodeColor(node.type)} stroke-2 stroke-border`}
                      fill="currentColor"
                    />

                    {/* Node Content */}
                    {isEditing ? (
                      <foreignObject x={(node.x || 0) - 70} y={(node.y || 0) - 10} width="140" height="50">
                        <div className="flex flex-col gap-1 p-1">
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-6 text-xs"
                            placeholder="Name"
                          />
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => saveEdit(node.id)} className="h-5 px-1">
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="h-5 px-1 bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </foreignObject>
                    ) : (
                      <>
                        {/* Icon */}
                        <foreignObject x={(node.x || 0) - 65} y={(node.y || 0) - 5} width="20" height="20">
                          <div className="text-current">{getIcon(node.type)}</div>
                        </foreignObject>

                        {/* Text */}
                        <text
                          x={(node.x || 0) - 40}
                          y={(node.y || 0) + 5}
                          className="text-xs font-medium fill-current"
                          textAnchor="start"
                        >
                          {node.name.length > 15 ? `${node.name.substring(0, 15)}...` : node.name}
                        </text>

                        {/* Action Buttons */}
                        <foreignObject x={(node.x || 0) + 30} y={(node.y || 0) - 10} width="40" height="30">
                          <div className="flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
                            {node.type !== "subsection" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => addChild(node.id, node.type)}
                                className="h-4 w-4 p-0 bg-white/20 hover:bg-white/40"
                              >
                                <Plus className="h-2 w-2" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(node)}
                              className="h-4 w-4 p-0 bg-white/20 hover:bg-white/40"
                            >
                              <Edit className="h-2 w-2" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNode(node.id, node.type)}
                              className="h-4 w-4 p-0 bg-white/20 hover:bg-white/40 text-red-300 hover:text-red-200"
                            >
                              <Trash2 className="h-2 w-2" />
                            </Button>
                          </div>
                        </foreignObject>
                      </>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
