"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowBigLeftDash } from "lucide-react"
import { useRouter } from "next/navigation"

type BackButtonProps = {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  className?: string
}

export const BackButton = ({
  variant = "secondary",
  size = "default",
  className,
}: BackButtonProps) => {
  const router = useRouter()
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => router.back()}
      className={cn(className, "space-x-1")}
    >
      <ArrowBigLeftDash
        size={22}
        className="shrink-0 animate-pulse text-primary"
      />
      <span>Back</span>
    </Button>
  )
}
