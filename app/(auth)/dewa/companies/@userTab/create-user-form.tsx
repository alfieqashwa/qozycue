import { Button, buttonVariants } from "@/components/ui/button"
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
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateUserForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { data: profile, status } = useTanstackQuery(
    convexQuery(api.users.me, {}),
  )
  const companies = useTanstackQuery(convexQuery(api.companies.findAll, {}))

  const upsertUser = useMutation({
    mutationFn: useConvexMutation(api.users.upsert),
    async onSuccess() {
      toast.success("Succeed!", {
        description: "Your new user has been created.",
      })
      setOpen(false)
    },
    onError(err) {
      toast.error("Uh oh! Something went wrong.", {
        description: err.message || "There was a problem with your request.",
      })
    },
    onSettled() {
      setOpen(false)
    },
  })

  // 1. Define form.
  const form = useForm<TUpsertUser>({
    resolver: zodResolver(upsertUserSchema),
    defaultValues: {
      email: "",
      role: "USER",
    },
  })

  // 2. Define a submit handler
  function onSubmit(values: TUpsertUser) {
    // Do something with the form values.
    // This will b type-safe and validated.

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
                    {["ADMIN", "MANAGER", "OWNER", "CASHIER"].map((role, i) => (
                      <SelectItem value={role} key={`${role}-${i}`}>
                        {role}
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
                Select your user&apos;s company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className="pt-8">
          <SheetClose
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "mt-1 md:mt-0",
            )}
          >
            Cancel
          </SheetClose>
          {upsertUser.isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button disabled={upsertUser.isPending} type="submit">
              Create User
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
