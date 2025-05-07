import { Copy } from "lucide-react"
import { WrapperTooltip } from "./wrapper-tooltip"

type HoverCopyIconProps = {
  id: string
}
export const HoverCopyIcon = ({ id }: HoverCopyIconProps) => (
  <WrapperTooltip content="Copy ID">
    <button onClick={() => navigator.clipboard.writeText(id)} className="mx-2">
      <Copy className="hover:text-primary invisible size-4 transition-all duration-500 ease-in group-hover:visible" />
    </button>
  </WrapperTooltip>
)
