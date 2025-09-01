"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"

const colorOptions = [
  { name: "Cyan", value: "cyan", colors: { light: "#0891b2", dark: "#06b6d4" } },
  { name: "Blue", value: "blue", colors: { light: "#2563eb", dark: "#3b82f6" } },
  { name: "Purple", value: "purple", colors: { light: "#7c3aed", dark: "#8b5cf6" } },
  { name: "Green", value: "green", colors: { light: "#059669", dark: "#10b981" } },
  { name: "Orange", value: "orange", colors: { light: "#ea580c", dark: "#f97316" } },
  { name: "Red", value: "red", colors: { light: "#dc2626", dark: "#ef4444" } },
  { name: "Pink", value: "pink", colors: { light: "#db2777", dark: "#ec4899" } },
  { name: "Indigo", value: "indigo", colors: { light: "#4f46e5", dark: "#6366f1" } },
]

export function ColorPalette() {
  const [selectedColor, setSelectedColor] = React.useState("cyan")

  React.useEffect(() => {
    // Load saved color from localStorage
    const savedColor = localStorage.getItem("hrm-primary-color")
    if (savedColor) {
      setSelectedColor(savedColor)
      applyColor(savedColor)
    }
  }, [])

  const applyColor = (colorValue: string) => {
    const colorOption = colorOptions.find((c) => c.value === colorValue)
    if (colorOption) {
      const root = document.documentElement
      root.style.setProperty("--primary-light", colorOption.colors.light)
      root.style.setProperty("--primary-dark", colorOption.colors.dark)

      // Update CSS custom properties for both light and dark modes
      root.style.setProperty("--primary", colorOption.colors.light)
      root.style.setProperty("--primary-foreground", "#ffffff")
    }
  }

  const handleColorChange = (colorValue: string) => {
    setSelectedColor(colorValue)
    localStorage.setItem("hrm-primary-color", colorValue)
    applyColor(colorValue)
  }

  const currentColor = colorOptions.find((c) => c.value === selectedColor)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Change primary color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">Primary Color</p>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedColor === color.value
                    ? "border-foreground shadow-md"
                    : "border-border hover:border-foreground/50"
                }`}
                style={{ backgroundColor: color.colors.light }}
                title={color.name}
              />
            ))}
          </div>
          {currentColor && <p className="text-xs text-muted-foreground mt-2">Current: {currentColor.name}</p>}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
