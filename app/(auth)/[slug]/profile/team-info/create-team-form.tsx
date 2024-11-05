import { zodResolver } from "@hookform/resolvers/zod"
import { Role, type Subscription } from "@prisma/client"
import { ToastAction } from "@radix-ui/react-toast"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
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
import { useToast } from "@/components/ui/use-toast"
import { validateSubscriptionLimits } from "@/lib/validate-subscription-limits"
import { api } from "@/trpc/react"
import { upsertTeamSchema, type TUpsertTeam } from "@/types/schema/user-schema"

export function CreateTeamForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const { data: profile, status } = api.user.me.useQuery()

  const upsertTeam = api.user.upsert.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your new team has been created.",
      })
      await utils.user.findAllByCompanyId.invalidate()
      setOpen(false)
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

  // 1. Define form.
  const form = useForm<TUpsertTeam>({
    resolver: zodResolver(upsertTeamSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  })

  const subscriptions = api.company.subscriptions.useQuery()
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
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please DO NOT input your own email, Dude!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }

    if (!isValid) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Max user limit exceeded",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
    upsertTeam.mutate({
      email: email.toLowerCase(),
      role,
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
                <Input placeholder="Email" {...field} />
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
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* ADMIN CANNOT create a new team where the role is "ADMIN" */}
                  {profile?.role === "DEWA" ? (
                    <SelectGroup>
                      <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
                      <SelectItem value={Role.OWNER}>{Role.OWNER}</SelectItem>
                      <SelectItem value={Role.MANAGER}>
                        {Role.MANAGER}
                      </SelectItem>
                      <SelectItem value={Role.CASHIER}>
                        {Role.CASHIER}
                      </SelectItem>
                    </SelectGroup>
                  ) : (
                    <SelectGroup>
                      {/* there's no role ADMIN in the list  */}
                      <SelectItem value={Role.OWNER}>{Role.OWNER}</SelectItem>
                      <SelectItem value={Role.MANAGER}>
                        {Role.MANAGER}
                      </SelectItem>
                      <SelectItem value={Role.CASHIER}>
                        {Role.CASHIER}
                      </SelectItem>
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
        {upsertTeam.isPending ? (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button disabled={upsertTeam.isPending} type="submit" size="sm">
            Create Team
          </Button>
        )}
      </form>
    </Form>
  )
}
