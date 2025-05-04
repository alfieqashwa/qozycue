import { SubmitButton } from "@/components/submit-button"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type DeleteCompanyProps = {
  id: Id<"companies">
  name: string
}

export function DeleteCompany({ id, name }: DeleteCompanyProps) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.remove),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p>
            Company <b>{name}</b> has been deleted.
          </p>
        ),
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({ id })
  }

  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const isSuperAdmin =
    me.status === "success" &&
    me.data?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!isSuperAdmin}
        className={cn(
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
          buttonVariants(),
        )}
      >
        <Trash />
        <span>Delete</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click <b>Delete Company</b> when
              you&apos;re sure to delete Company
              <span className="text-primary px-1.5 font-medium uppercase">
                {name}.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end">
            <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </DialogClose>
            <SubmitButton
              title="Delete Company"
              isPending={isPending}
              disabled={!isSuperAdmin || isPending}
              variant="destructive"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
