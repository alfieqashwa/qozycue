import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const PrintTooltip = ({
  contentText,
  children,
}: {
  contentText: string
  children: React.ReactNode
}) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent className="flex items-center gap-4 bg-muted">
      <span className="whitespace-nowrap text-xs capitalize text-muted-foreground">
        {contentText}
      </span>
    </TooltipContent>
  </Tooltip>
)
