import { roles } from "@/app/constants/options"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import {
  TUpdateRoleById,
  updateRoleByIdSchema,
} from "@/types/schema/user-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type UpdateTeamProps = {
  name: string | undefined
  email: string | undefined
} & TUpdateRoleById

export function UpdateTeam({ id, name, role, email }: UpdateTeamProps) {
  const [open, setOpen] = useState(false)

  const { data: profile, status } = useTanstackQuery(
    convexQuery(api.users.me, {}),
  )

  const disabled =
    (status === "success" &&
      profile?.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN &&
      email === process.env.NEXT_PUBLIC_SUPER_ADMIN) ||
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
                lowercase: name == null,
              })}
            >
              {name ?? email}
            </span>
            role of your team here. Click Update Team when you&apos;re done.
          </p>
        </DialogHeader>
        <UpdateTeamForm id={id} role={role} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

type UpdateTeamFormProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
} & TUpdateRoleById
export const UpdateTeamForm = ({ id, role, setOpen }: UpdateTeamFormProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.updateRoleByIdAdminProcedure),
    onSuccess() {
      toast.success("Succeed!", {
        description: "Your team has been updated.",
      })
    },
    onError(err) {
      toast.error("Something went wrong.", {
        description: err.message || "There was a problem with your request.",
      })
    },
    onSettled() {
      setOpen(false)
    },
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as Role}
              >
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
            <Button type="submit">Update Team</Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  )
}
