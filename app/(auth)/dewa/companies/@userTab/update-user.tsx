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

  const isSuperAdmin = email === process.env.NEXT_PUBLIC_SUPER_ADMIN
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
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
            Click <b>Update User</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UpdateUserForm
          id={id}
          role={role}
          companyId={companyId}
          setOpen={setOpen}
          isSuperAdmin={isSuperAdmin}
        />
      </DialogContent>
    </Dialog>
  )
}
