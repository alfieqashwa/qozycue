import { Button, buttonVariants } from "@/components/ui/button"
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
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Role } from "@/types"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  id: Id<"users">
  username: string | undefined
  email: string | undefined
  currentRole: Role
  currentCompanyId: Id<"companies"> | undefined
}

export function UpdateUser({
  id,
  username,
  email,
  currentRole,
  currentCompanyId,
}: Props) {
  const [open, setOpen] = useState(false)

  const { data: profile, status } = useTanstackQuery(
    convexQuery(api.users.me, {}),
  )
  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: useConvexMutation(api.users.updateRoleAndCompanyId),
    onSuccess() {
      toast.success("Succeed!", {
        description: "User has been updated.",
      })
    },
    onError(err) {
      toast.error("Something went wrong.", {
        description: err.message || "There was a problem with your request.",
      })
    },
    onSettled() {
      setOpen(false)
      reset()
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const role = formData.get("role") as unknown as Role
    const companyId = formData.get("companyId") as Id<"companies">

    mutate({
      id,
      role,
      companyId,
    })
  }

  const disabled =
    status === "success" &&
    profile?.email !== process.env.DEWA_EMAIL &&
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
                lowercase: username == null,
              })}
            >
              {username ?? email}
            </span>
          </DialogTitle>
          <DialogDescription>
            Click <span className="font-semibold">Update User</span> when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-6 py-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name" className="mb-1">
              Role
            </Label>
            <SelectRole
              isSuperAdmin={email === process.env.DEWA_EMAIL}
              role={currentRole}
            />
            {/* {error?.data?.zodError?.fieldErrors.role && (
              <span className="text-xs text-destructive">
                {error.data.zodError.fieldErrors.role}
              </span>
            )} */}
            {/* // TODO: configure error message */}
            {error?.message}
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name" className="mb-1">
              Company
            </Label>
            <SelectCompany companyId={currentCompanyId ?? ""} />
            {/* {error?.data?.zodError?.fieldErrors.companyId && (
              <span className="text-xs text-destructive">
                {error.data.zodError.fieldErrors.companyId}
              </span>
            )} */}
            {/* // TODO: configure error message */}
            {error?.message}
          </div>
          <DialogFooter className="flex flex-row items-center justify-end space-x-2">
            <DialogClose
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Cancel
            </DialogClose>
            {isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit">Update User</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SelectRole({
  isSuperAdmin,
  role,
}: {
  isSuperAdmin: boolean
  role: Role
}) {
  return (
    <Select name="role" defaultValue={role as unknown as string}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {isSuperAdmin ? (
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            {["DEWA", "ADMIN", "MANAGER", "OWNER", "CASHIER"].map((role, i) => (
              <SelectItem value={role} key={`${role}-${i}`}>
                {role}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : (
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            {["ADMIN", "MANAGER", "OWNER", "CASHIER"].map((role, i) => (
              <SelectItem value={role} key={`${role}-${i}`}>
                {role}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  )
}

function SelectCompany({ companyId }: { companyId: string }) {
  const { data: companies, status } = useTanstackQuery(
    convexQuery(api.companies.findAll, {}),
  )

  return (
    <Select name="companyId" defaultValue={companyId}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Company</SelectLabel>
          {status === "success" &&
            companies.map((c) => (
              <SelectItem value={c._id} key={c._id}>
                <span className="capitalize">{c.name}</span>
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
