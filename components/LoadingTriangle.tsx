import { cn } from "@/lib/utils"
import { GiPoolTriangle } from "react-icons/gi"

type Props = { classNames?: string }

export function LoadingTriangle(props: Props) {
  return (
    <div className="grid min-h-screen w-full place-items-center">
      <GiPoolTriangle
        //   color="rgb(148 163 184)"
        className={cn(
          "text-primary size-14 animate-ping md:size-16",
          props.classNames,
        )}
      />
    </div>
  )
}
