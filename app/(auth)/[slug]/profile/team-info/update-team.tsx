import { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { env } from "@/env"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"

export function UpdateTeam({
  id,
  username,
  currentRole,
  email,
}: {
  id: string
  username: string | null
  email: string | null
  currentRole: Role
}) {
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)

  const { data: profile, status } = api.user.me.useQuery()

  const { mutate, isPending, error } = api.user.updateRoleById.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your team has been updated.",
      })
      await utils.user.findAllByCompanyId.invalidate()
      router.refresh()

      /* auto-closed after succeed submit the dialog form */
      setOpen(false)
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const role = formData.get("role") as Role

    mutate({
      id,
      role,
    })
  }

  const disabled =
    (status === "success" &&
      profile?.email !== env.NEXT_PUBLIC_DEWA &&
      email === env.NEXT_PUBLIC_DEWA) ||
    profile?.role === "ADMIN"
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
          <DialogTitle>Update Team</DialogTitle>
          <p>
            Edit
            <span
              className={cn("px-1 capitalize text-amber-300", {
                lowercase: username == null,
              })}
            >
              {username ?? email}
            </span>
            role of your team here. Click Update Team when you&apos;re done.
          </p>
        </DialogHeader>
        <form className="grid gap-4 py-3" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name" className="mb-1">
              User Role
            </Label>
            <SelectRole role={currentRole} />
            {error?.data?.zodError?.fieldErrors.role && (
              <span className="text-xs text-destructive">
                {error.data.zodError.fieldErrors.role}
              </span>
            )}
          </div>
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
              <Button disabled size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" size="sm">
                Update Team
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function SelectRole({ role }: { role: Role }) {
  return (
    <Select name="role" defaultValue={role}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
          <SelectItem value={Role.MANAGER}>{Role.MANAGER}</SelectItem>
          <SelectItem value={Role.OWNER}>{Role.OWNER}</SelectItem>
          <SelectItem value={Role.CASHIER}>{Role.CASHIER}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
