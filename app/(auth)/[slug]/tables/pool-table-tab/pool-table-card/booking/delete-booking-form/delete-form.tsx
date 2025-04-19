import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export const DeleteForm = ({
  isPending,
  handleSubmit,
}: {
  isPending: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) => (
  <form onSubmit={handleSubmit}>
    {isPending ? (
      <Button disabled variant="destructive" className="w-full">
        <Loader2 className="size-4 animate-spin" />
        Please wait
      </Button>
    ) : (
      <Button type="submit" variant="destructive" className="w-full">
        Delete Booking
      </Button>
    )}
  </form>
)
