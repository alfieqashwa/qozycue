import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { TUpdateRoleById } from "@/types/schema/user-schema"
import { useState } from "react"
import { UpdateTeamForm } from "./update-team-form"

type UpdateTeamProps = {
  name: string | undefined
  email: string | undefined
} & TUpdateRoleById

export function UpdateTeam({ id, name, role, email }: UpdateTeamProps) {
  const [open, setOpen] = useState(false)

  const disabled = role === "ADMIN"
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className="whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          Edit Role
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>
            Update{" "}
            <span
              className={cn("px-1 capitalize text-amber-300", {
                lowercase: name == null,
              })}
            >
              {name ?? email}
            </span>
          </DialogTitle>
          <DialogDescription>
            Click <b>Update Team</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UpdateTeamForm id={id} role={role} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
