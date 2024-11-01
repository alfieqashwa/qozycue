import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { Loader2, Trash } from "lucide-react"
import { toast } from "sonner"

type DeleteCompanyProps = {
  id: Id<"companies">
  name: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeleteCompany({ id, name, setOpen }: DeleteCompanyProps) {
  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const isDewa = me.data?.email === process.env.DEWA_EMAIL

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.remove),
    onSuccess() {
      toast.success("Succeed!", {
        description: (
          <p>
            Company <span className="capitalize">{name}</span> has been deleted.
          </p>
        ),
      })
    },
    onError(err) {
      toast.error("Something went wrong!", {
        description: err.message || "There was a problem with your request.",
      })
    },
    onSettled() {
      setOpen(false)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate({ id })
  }

  return (
    <Dialog>
      <DialogTrigger
        disabled={isDewa}
        className="flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground"
      >
        <Trash className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                You can&apos;t undo this changes. Click Delete Company when
                you&apos;re sure to delete Company
                <span className="px-1.5 font-medium uppercase text-primary">
                  {name}.
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isPending ? (
              <Button disabled variant="destructive" size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive" size="sm">
                Delete Company
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
