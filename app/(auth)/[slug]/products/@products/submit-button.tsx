import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export const SubmitButton = ({
  title,
  isPending,
  disabled,
}: {
  title: string
  isPending: boolean
  disabled: boolean
}) => (
  <Button
    disabled={disabled || isPending}
    type="submit"
    className="disabled:pointer-events-auto disabled:cursor-not-allowed md:w-auto"
  >
    {isPending ? (
      <>
        <Loader2 className="size-4 animate-spin" />
        <span>Please wait</span>
      </>
    ) : (
      <span>{title}</span>
    )}
  </Button>
)
