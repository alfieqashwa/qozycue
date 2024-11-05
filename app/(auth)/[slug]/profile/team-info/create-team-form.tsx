import { roles } from "@/app/constants/options"
import { Button } from "@/components/ui/button"
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import { validateSubscriptionLimits } from "@/lib/validate-subscription-limits"
import { Role, Subscription } from "@/types"
import { upsertTeamSchema, type TUpsertTeam } from "@/types/schema/user-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateTeamForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { data: profile, status } = useTanstackQuery(
    convexQuery(api.users.me, {}),
  )
  useMutation

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.upsert),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Your new team has been created.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description: err.message || "There was a problem with your request.",
      }),
    onSettled: () => setOpen(false),
  })

  // 1. Define form.
  const form = useForm<TUpsertTeam>({
    resolver: zodResolver(upsertTeamSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  })

  const subscriptions = useTanstackQuery({
    enabled: Boolean(profile?.companyId),
    ...convexQuery(api.companies.subscriptions, {
      companyId: profile?.companyId,
    }),
  })

  // TODOS: move this validation logic into internal api
  const isValid = validateSubscriptionLimits({
    status: subscriptions.status,
    subscription: subscriptions.data?.subscription as Subscription,
    userLen: subscriptions.data?._count.users,
  })
  // 2. Define a submit handler
  function onSubmit(values: TUpsertTeam) {
    // Do something with the form values.
    // This will b type-safe and validated.

    const { email, role } = values

    // avoid user to input his / her own email.
    if (status === "success" && profile?.email === email) {
      return toast.error("Something went wrong.", {
        description: "Please DO NOT input your own email, Dude!",
      })
    }

    if (!isValid) {
      return toast.error("Something went wrong.", {
        description: "Max user limit exceeded",
      })
    }

    mutate({
      upsertUserSchema: {
        email: email.toLowerCase(),
        role,
        companyId: profile?.companyId,
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
                  {/* ADMIN CANNOT create a new team where the role is "ADMIN" */}
                  {profile?.role === "DEWA" ? (
                    <SelectGroup>
                      {roles
                        .filter((r) => r.value !== "DEWA")
                        .map((role, i) => (
                          <SelectItem value={role.value} key={i}>
                            {role.label}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ) : (
                    <SelectGroup>
                      {roles
                        .filter(
                          (r) => r.value !== "DEWA" && r.value !== "ADMIN",
                        )
                        .map((role, i) => (
                          <SelectItem value={role.value} key={i}>
                            {role.label}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
              <FormDescription className="pt-2">
                Select your team&apos;s access level.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isPending ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button disabled={isPending} type="submit">
            Create Team
          </Button>
        )}
      </form>
    </Form>
  )
}
