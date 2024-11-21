"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const WrapperTooltip = (props: {
  side?: "top" | "right" | "bottom" | "left" | undefined
  content: string
  className?: string
  children: React.ReactNode
}) => (
  <Tooltip>
    <TooltipTrigger>{props.children}</TooltipTrigger>
    <TooltipContent
      side={props.side}
      className={cn(
        "bg-muted font-sans text-xs font-medium tracking-wider text-muted-foreground",
        props.className,
      )}
    >
      {props.content}
    </TooltipContent>
  </Tooltip>
)
