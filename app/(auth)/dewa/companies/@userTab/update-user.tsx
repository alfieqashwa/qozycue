import { Button } from "@/components/ui/button"
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className="whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          Edit Role
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Update User</SheetTitle>
          <p>
            Edit
            <span
              className={cn("px-1 capitalize text-amber-300", {
                lowercase: username == null,
              })}
            >
              {username ?? email}
            </span>
            user here. Click Update User when you&apos;re done.
          </p>
        </SheetHeader>
        <form className="grid gap-4 py-3" onSubmit={handleSubmit}>
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
          <SheetFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
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
                Update User
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
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
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        {isSuperAdmin ? (
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            <SelectItem value="DEWA">DEWA</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="MANAGER">MANAGER</SelectItem>
            <SelectItem value="OWNER">OWNER</SelectItem>
            <SelectItem value="CASHIER">CASHIER</SelectItem>
          </SelectGroup>
        ) : (
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="MANAGER">MANAGER</SelectItem>
            <SelectItem value="OWNER">OWNER</SelectItem>
            <SelectItem value="CASHIER">CASHIER</SelectItem>
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
      <SelectTrigger className="w-[180px]">
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
