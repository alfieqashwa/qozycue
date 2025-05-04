import { roles } from "@/app/constants/options"
import { SubmitButton } from "@/components/submit-button"
import { buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { Role } from "@/types"
import { upsertUserSchema, type TUpsertUser } from "@/types/schema/user-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQueries as useTanstackQueries,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateUserForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [{ data: profile, status }, companies] = useTanstackQueries({
    queries: [
      convexQuery(api.users.me, {}),
      convexQuery(api.companies.findAllSuperAdminProcedure, {}),
    ],
  })

  const upsertUser = useMutation({
    mutationFn: useConvexMutation(api.users.upsertSuperAdminProcedure),
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: "Your new user has been created.",
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const form = useForm<TUpsertUser>({
    resolver: zodResolver(upsertUserSchema),
    defaultValues: {
      email: "",
      role: "USER",
    },
  })
  function onSubmit(values: TUpsertUser) {
    const { email, role, companyId } = values
    // avoid user to input his / her own email.
    if (status === "success" && profile?.email === email) {
      return toast.error("Something went wrong.", {
        description: "Please DO NOT input your own email, Dude!",
      })
    }
    upsertUser.mutate({
      upsertUserSchema: {
        email: email.toLowerCase(),
        role,
        companyId,
      },
    })
  }

  return (
    <ScrollArea className="h-[calc(100vh_-_7rem)] px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="pt-4">
                <FormLabel>User Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" className="w-[200px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      {roles.map((role, i) => (
                        <SelectItem
                          value={role.value}
                          key={`${role.label}-${i}`}
                        >
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
          <SheetFooter className="mt-20 flex flex-col-reverse md:flex-row md:justify-end md:space-x-2">
            <SheetClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </SheetClose>
            <SubmitButton
              title="Create User"
              isPending={upsertUser.isPending}
            />
          </SheetFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
