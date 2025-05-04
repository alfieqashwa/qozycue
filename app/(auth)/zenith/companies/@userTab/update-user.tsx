import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Role } from "@/types"
import { Pencil } from "lucide-react"
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
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Pencil />
        <span className="whitespace-nowrap">Edit Role</span>
      </DialogTrigger>
      <DialogContent className="bg-card min-w-full sm:min-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            Edit
            <span
              className={cn("px-1 text-amber-300 capitalize", {
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
