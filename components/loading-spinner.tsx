import { Loader2 } from "lucide-react"

type Props = { size?: number }
export const LoadingSpinner = ({ size = 50 }: Props) => (
  <div className="grid h-[calc(64vh)] w-full place-items-center">
    <Loader2 size={size} className="animate-spin text-primary/75" />
  </div>
)
