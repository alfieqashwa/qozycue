"use client"

import { Apple, Bird, Cherry, Citrus, Fish } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function ToggleThemes() {
  const { theme, setTheme } = useTheme()

  let icon
  switch (theme) {
    case "system":
      icon = <Bird />
      break
    case "light":
      icon = <Apple />
      break
    case "orange":
      icon = <Citrus />
      break
    case "cherry":
      icon = <Cherry />
      break
    case "fish":
      icon = <Fish />
      break
    default:
      icon = <Bird />
      break
  }

  const toggleButton = icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary">
          {toggleButton}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount className="z-[70]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            theme === "light" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Apple className="mr-2 h-4 w-4" />
          <span>Apple</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            theme === "dark" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Bird className="mr-2 h-4 w-4" />
          <span>Bird</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("orange")}
          className={cn(
            theme === "orange" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Citrus className="mr-2 h-4 w-4" />
          <span>Orange</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("cherry")}
          className={cn(
            theme === "cherry" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Cherry className="mr-2 h-4 w-4" />
          <span>Cherry</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("fish")}
          className={cn(
            theme === "fish" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Fish className="mr-2 h-4 w-4" />
          <span>Fish</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
