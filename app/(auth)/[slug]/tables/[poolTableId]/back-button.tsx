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
  classNames?: string
}

export const BackButton = ({
  variant = "secondary",
  size = "default",
  classNames,
}: BackButtonProps) => {
  const router = useRouter()
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => router.back()}
      className={cn(classNames)}
    >
      <ArrowBigLeftDash
        size={24}
        className="text-primary size-6 shrink-0 animate-pulse"
      />
      <span>Back</span>
    </Button>
  )
}
