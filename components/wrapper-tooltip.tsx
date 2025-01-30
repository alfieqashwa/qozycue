"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const WrapperTooltip = (props: {
  side?: "top" | "right" | "bottom" | "left" | undefined
  icon?: React.ReactNode
  content: string
  className?: string
  children: React.ReactNode
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{props.children}</TooltipTrigger>
    <TooltipContent
      side={props.side}
      className={cn(
        "bg-muted font-sans text-xs font-medium tracking-wider text-muted-foreground",
        props.className,
      )}
    >
      <p className="flex items-center">
        {props.icon}
        {props.content}
      </p>
    </TooltipContent>
  </Tooltip>
)
