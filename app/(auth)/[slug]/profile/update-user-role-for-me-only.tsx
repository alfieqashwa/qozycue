import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import {
  TUpdateRoleByIdOnlyForSuperAmin,
  updateRoleByIdOnlyForSuperAminSchema,
} from "@/types/schema/user-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function UpdateUserRoleForMeOnly({
  id,
  role,
}: TUpdateRoleByIdOnlyForSuperAmin) {
  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.updateRoleByIdOnlyForSuperAmin),
    onSuccess: () => {
      router.refresh()
      toast.success("Succeed!", {
        description: "Role has been updated.",
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const form = useForm<TUpdateRoleByIdOnlyForSuperAmin>({
    resolver: zodResolver(updateRoleByIdOnlyForSuperAminSchema),
    defaultValues: {
      id,
      role,
    },
  })

  const disabled = form.watch("role") === role

  function onSubmit(values: TUpdateRoleByIdOnlyForSuperAmin) {
    const { role } = values
    mutate({
      updateRoleByIdOnlyForSuperAminSchema: {
        id,
        role,
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center space-x-4"
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormLabel className="text-primary text-base">Role</FormLabel>
                <FormControl className="w-[180px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {["ZENITH", "ADMIN", "OWNER", "MANAGER", "CASHIER"].map(
                      (role, i) => (
                        <SelectItem value={role} key={`${i}-${role}`}>
                          {role}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={disabled || isPending}
          size="default"
          className="mt-8"
        >
          Update Role
        </Button>
      </form>
    </Form>
  )
}
