import { Role } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { api } from "@/trpc/react"

export function UpdateUserRoleForMeOnly({
  userId,
  userRole,
}: {
  userId?: string
  userRole?: string
}) {
  const utils = api.useUtils()
  const { toast } = useToast()
  const router = useRouter()

  const { mutate, isPending } = api.user.updateRoleByIdOnlyForMe.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Role has been updated.",
      })
      await utils.user.find.invalidate()
      /* auto-closed after succeed submit the dialog form */
      router.refresh()
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

  function updateRole(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const role = formData.get("role") as Role

    mutate({
      id: userId as string,
      role,
    })
  }

  return (
    <form onSubmit={updateRole} className="mt-2 flex items-center space-x-4">
      <Select name="role" defaultValue={userRole}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            <SelectItem value={Role.DEWA}>{Role.DEWA}</SelectItem>
            <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
            <SelectItem value={Role.MANAGER}>{Role.MANAGER}</SelectItem>
            <SelectItem value={Role.OWNER}>{Role.OWNER}</SelectItem>
            <SelectItem value={Role.CASHIER}>{Role.CASHIER}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isPending} size="default">
        Update Role
      </Button>
    </form>
  )
}
