import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export const SubmitButton = ({
  title,
  isPending,
  disabled = false,
  variant = "default",
  className,
}: {
  title: string
  isPending: boolean
  disabled?: boolean
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined
  className?: string
}) => (
  <Button
    disabled={disabled || isPending}
    type="submit"
    variant={variant}
    className={cn(
      "disabled:pointer-events-auto disabled:cursor-not-allowed md:w-auto",
      className,
    )}
  >
    {isPending ? (
      <>
        <Loader2 className="size-4 animate-spin" />
        <span className="whitespace-nowrap">Please wait</span>
      </>
    ) : (
      <span className="whitespace-nowrap capitalize">{title}</span>
    )}
  </Button>
)
