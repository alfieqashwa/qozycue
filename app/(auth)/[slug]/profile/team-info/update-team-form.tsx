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
import {
  TUpdateRoleById,
  updateRoleByIdSchema,
} from "@/types/schema/user-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type UpdateTeamFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
} & TUpdateRoleById
export const UpdateTeamForm = ({ id, role, setOpen }: UpdateTeamFormProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.updateRoleByIdAdminProcedure),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Your team has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TUpdateRoleById>({
    resolver: zodResolver(updateRoleByIdSchema),
    defaultValues: {
      id,
      role,
    },
  })

  function onSubmit(values: TUpdateRoleById) {
    const { role } = values

    mutate({
      updateRoleByIdSchema: {
        id,
        role,
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
                      .filter((r) => r.value !== "DEWA")
                      .map((role, i) => (
                        <SelectItem value={role.value} key={`${role}-${i}`}>
                          {role.label}
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
        <DialogFooter className="flex flex-row items-center justify-end space-x-2">
          <DialogClose className={cn(buttonVariants({ variant: "secondary" }))}>
            Cancel
          </DialogClose>
          {isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              disabled={form.watch("role") === role}
              type="submit"
              className="disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              Update Team
            </Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  )
}
