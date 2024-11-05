import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Role } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { useState } from "react"
import { UpdateUserForm } from "./update-user-form"

type UpdateUserProps = {
  id: Id<"users">
  name: string | undefined
  email: string | undefined
  role: Role
  companyId: Id<"companies"> | undefined
}

export function UpdateUser({
  id,
  name,
  email,
  role,
  companyId,
}: UpdateUserProps) {
  const [open, setOpen] = useState(false)

  const profile = useTanstackQuery(convexQuery(api.users.me, {}))

  const disabled =
    profile.status === "success" &&
    profile.data?.email !== process.env.DEWA_EMAIL &&
    email === process.env.DEWA_EMAIL
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant="secondary"
          size="sm"
          className="whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          Edit Role
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-full bg-card sm:min-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            Edit
            <span
              className={cn("px-1 capitalize text-amber-300", {
                lowercase: name == null,
              })}
            >
              {name ?? email}
            </span>
          </DialogTitle>
          <DialogDescription>
            Click <span className="font-semibold">Update User</span> when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UpdateUserForm
          id={id}
          role={role}
          companyId={companyId}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  )
}
