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
      icon = <Bird className="size-4" />
      break
    case "apple":
      icon = <Apple className="size-4" />
      break
    case "orange":
      icon = <Citrus className="size-4" />
      break
    case "cherry":
      icon = <Cherry className="size-4" />
      break
    case "fish":
      icon = <Fish className="size-4" />
      break
    default:
      icon = <Bird className="size-4" />
      break
  }

  const toggleButton = icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} size={"sm"} className="text-primary">
          {toggleButton}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount className="z-70">
        <DropdownMenuItem
          onClick={() => setTheme("apple")}
          className={cn(
            theme === "apple" ? "text-primary" : "text-muted-foreground",
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
