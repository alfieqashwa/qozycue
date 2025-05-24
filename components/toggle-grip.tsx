import { useToggleStore } from "@/store/toggle-store"
import { GripVertical } from "lucide-react"
import { WrapperTooltip } from "./wrapper-tooltip"

export function ToggleGrip() {
  const store = useToggleStore()
  return (
    <WrapperTooltip content={store.toggle ? "Open" : "Close"} side="left">
      <button
        onClick={store.onToggle}
        className="text-muted-foreground hover:text-primary absolute top-[10.20rem] -right-4 z-50 transition-colors duration-500 ease-in-out"
      >
        <GripVertical size={28} />
      </button>
    </WrapperTooltip>
  )
}
