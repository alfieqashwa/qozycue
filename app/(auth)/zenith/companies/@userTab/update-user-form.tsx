import { roles } from "@/app/constants/options"
import { Button, buttonVariants } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { cn } from "@/lib/utils"
import { Role } from "@/types"
import { TUpdateUser, updateUserSchema } from "@/types/schema/user-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type UpdateUserFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSuperAdmin: boolean
} & TUpdateUser

export function UpdateUserForm({
  id,
  role,
  companyId,
  setOpen,
  isSuperAdmin,
}: UpdateUserFormProps) {
  const router = useRouter()

  const companies = useTanstackQuery(convexQuery(api.companies.findAll, {}))

  const { mutate, isPending, reset } = useMutation({
    mutationFn: useConvexMutation(api.users.updateRoleAndCompanyId),
    onSuccess: () => {
      toast.success("Succeed!", {
        description: "User has been updated.",
      })
      setOpen(false)
      reset()
      router.refresh()
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const form = useForm<TUpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id,
      role,
      companyId,
    },
  })
  function onSubmit(values: TUpdateUser) {
    const { role, companyId } = values
    mutate({
      updateUserSchema: {
        id,
        role,
        companyId,
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="pt-4">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormLabel>Role</FormLabel>
                <FormControl className="w-[200px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    {roles
                      .filter((role) => isSuperAdmin || role.value !== "ZENITH") // short-circuiting || operator
                      .map((role, i) => (
                        <SelectItem
                          value={role.value}
                          key={`${role.label}-${i}`}
                        >
                          {role.value}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription className="pt-2">
                Select user&apos;s access level.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem className="pt-4">
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as Role}
              >
                <FormLabel>Company</FormLabel>
                <FormControl className="w-[200px] capitalize">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {companies.status === "success" &&
                      companies.data.map((company) => (
                        <SelectItem
                          value={company._id}
                          key={company._id}
                          className="capitalize"
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription className="pt-2">
                Select user&apos;s company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="flex flex-row items-center justify-end space-x-2">
          <DialogClose className={cn(buttonVariants({ variant: "secondary" }))}>
            Cancel
          </DialogClose>
          {isPending ? (
            <Button disabled>
              <Loader2 className="size-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit">Update User</Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  )
}
