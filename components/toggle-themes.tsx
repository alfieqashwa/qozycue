"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Apple, Cherry, Citrus, Grape, Vegan } from "lucide-react"
import { useTheme } from "next-themes"

export default function ToggleThemes() {
  const { theme, setTheme } = useTheme()

  let icon
  switch (theme) {
    case "system":
      icon = <Vegan className="size-5" />
      break
    case "light":
      icon = <Apple className="size-5" />
      break
    case "orange":
      icon = <Citrus className="size-5" />
      break
    case "cherry":
      icon = <Cherry className="size-5" />
      break
    case "grape":
      icon = <Grape className="size-5" />
      break
    default:
      icon = <Vegan className="size-5" />
      break
  }

  const toggleButton = icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"secondary"}
          size={"sm"}
          className="text-primary mr-4 ml-2"
        >
          <span>{toggleButton}</span>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "hover:cursor-pointer",
            theme === "light" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Apple
            className={cn(
              "hover:cursor-pointer",
              theme === "light" ? "text-primary" : "text-foreground",
            )}
          />
          <span>Apple</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("cherry")}
          className={cn(
            "hover:cursor-pointer",
            theme === "cherry" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Cherry
            className={cn(
              theme === "cherry" ? "text-primary" : "text-foreground",
            )}
          />
          <span>Cherry</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("grape")}
          className={cn(
            "hover:cursor-pointer",
            theme === "grape" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Grape
            className={cn(
              theme === "grape" ? "text-primary" : "text-foreground",
            )}
          />
          <span>Grape</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("orange")}
          className={cn(
            "hover:cursor-pointer",
            theme === "orange" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Citrus
            className={cn(
              theme === "orange" ? "text-primary" : "text-foreground",
            )}
          />
          <span>Orange</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "hover:cursor-pointer",
            theme === "dark" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Vegan
            className={cn(
              theme === "dark" ? "text-primary" : "text-foreground",
            )}
          />
          <span>Vegan</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
