import { GripVertical } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToggleStore } from "@/store/toggle-store"

export function ToggleGrip() {
  const store = useToggleStore()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={store.onToggle}
          className="absolute -right-4 top-[10.20rem] z-50 text-muted-foreground transition-colors duration-500 ease-in-out hover:text-primary"
        >
          <GripVertical size={28} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="flex items-center gap-4 bg-muted">
        <span className="text-sm capitalize text-muted-foreground">
          {store.toggle ? "Open" : "Close"}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}
