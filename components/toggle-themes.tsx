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

  const themeTitle = ["apple", "dark", "orange", "cherry", "fish"]

  let toggleButton
  switch (theme) {
    case "system":
      toggleButton = <Bird className="size-4" />
      break
    case "apple":
      toggleButton = <Apple className="size-4" />
      break
    case "orange":
      toggleButton = <Citrus className="size-4" />
      break
    case "cherry":
      toggleButton = <Cherry className="size-4" />
      break
    case "fish":
      toggleButton = <Fish className="size-4" />
      break
    default:
      toggleButton = <Bird className="size-4" />
      break
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"secondary"} size={"sm"} className="text-primary">
          {toggleButton}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount className="z-70">
        {themeTitle.map((title, i) => (
          <DropdownMenuItem
            onClick={() => setTheme(title)}
            className={cn(
              theme === title ? "text-primary" : "text-muted-foreground",
            )}
            key={`${i}-${title}`}
          >
            <span
              className={cn(
                theme === `${title}` ? "text-primary" : "text-muted-foreground",
              )}
            >
              <ThemeIcon title={title} theme={theme} />
            </span>
            <span className="capitalize">{title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ThemeIcon = ({
  title,
  theme,
}: {
  title: string
  theme: string | undefined
}) => {
  let icon
  switch (title) {
    case "apple":
      icon = (
        <Apple
          className={cn(
            theme === title ? "text-primary" : "text-foreground",
            "mr-2 size-4",
          )}
        />
      )
      break
    case "bird":
      icon = (
        <Bird
          className={cn(
            theme === title ? "text-primary" : "text-foreground",
            "mr-2 size-4",
          )}
        />
      )
      break
    case "orange":
      icon = (
        <Citrus
          className={cn(
            theme === title ? "text-primary" : "text-foreground",
            "mr-2 size-4",
          )}
        />
      )
      break
    case "cherry":
      icon = (
        <Cherry
          className={cn(
            theme === title ? "text-primary" : "text-foreground",
            "mr-2 size-4",
          )}
        />
      )
      break
    case "fish":
      icon = (
        <Fish
          className={cn(
            theme === title ? "text-primary" : "text-foreground",
            "mr-2 size-4",
          )}
        />
      )
      break
    default:
      icon = (
        <Bird
          className={cn(
            theme === title ? "text-primary" : "text-foreground",
            "mr-2 size-4",
          )}
        />
      )
  }

  return <span>{icon}</span>
}
