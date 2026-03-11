"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-full justify-start px-2 gap-2 text-sidebar-foreground opacity-50">
        <div className="w-4 h-4" />
        <span className="text-sm font-medium">Loading...</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start px-2 gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-orange-400" />
      ) : (
        <Moon className="h-4 w-4 text-blue-400" />
      )}
      <span className="text-sm font-medium">
        {isDark ? "Light Mode" : "Dark Mode"}
      </span>
    </Button>
  )
}
