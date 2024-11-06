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
import { api } from "@/convex/_generated/api"
import { Role } from "@/types"
import { TUpdateRoleByIdOnlyForSuperAmin } from "@/types/schema/user-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

export function UpdateUserRoleForMeOnly({
  id,
  role,
}: TUpdateRoleByIdOnlyForSuperAmin) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.updateRoleByIdOnlyForSuperAmin),
    async onSuccess() {
      toast.success("Succeed!", {
        description: "Role has been updated.",
      })
    },
    onError(err) {
      const errrorMesage =
        err instanceof ConvexError ? err.data : "Unexpected error occurred"
      toast.error("Something went wrong.", {
        description: errrorMesage,
      })
    },
  })

  function updateRole(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const role = formData.get("role") as Role

    mutate({
      updateRoleByIdOnlyForSuperAminSchema: {
        id,
        role,
      },
    })
  }

  return (
    <form onSubmit={updateRole} className="mt-2 flex items-center space-x-4">
      <Select name="role" defaultValue={role}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            {["DEWA", "ADMIN", "OWNER", "MANAGER", "CASHIER"].map((role, i) => (
              <SelectItem value={role} key={`${i}-${role}`}>
                {role}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isPending} size="default">
        Update Role
      </Button>
    </form>
  )
}
