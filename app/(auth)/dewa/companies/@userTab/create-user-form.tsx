import { zodResolver } from "@hookform/resolvers/zod"
// import { Role, type Subscription } from "@prisma/client"
import { ToastAction } from "@radix-ui/react-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
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
// import { validateSubscriptionLimits } from "@/lib/validate-subscription-limits"
// import { wait } from "@/lib/wait"
// import { api } from "@/trpc/react"
import { upsertUserSchema, type TUpsertUser } from "@/types/schema/user-schema"

export function CreateUserForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const { data: profile, status } = api.user.me.useQuery()
  const companies = api.company.findAllDewa.useQuery()

  const upsertUser = api.user.upsertDewa.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your new user has been created.",
      })
      await utils.company.subscriptions.invalidate()
      router.refresh()
      await wait().then(() => setOpen(false))
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
  const form = useForm<TUpsertUser>({
    resolver: zodResolver(upsertUserSchema),
    defaultValues: {
      email: "",
      role: Role.USER,
    },
  })

  const subscriptions = api.company.subscriptions.useQuery()

  const isValid = validateSubscriptionLimits({
    status: subscriptions.status,
    subscription: subscriptions.data?.subscription as Subscription,
    userLen: subscriptions.data?._count.users,
  })
  // 2. Define a submit handler
  function onSubmit(values: TUpsertUser) {
    // Do something with the form values.
    // This will b type-safe and validated.

    const { email, role, companyId } = values

    if (!isValid) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Max user limit exceeded",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }

    // avoid user to input his / her own email.
    if (status === "success" && profile?.email === email) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please DO NOT input your own email, Dude!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }

    upsertUser.mutate({
      email: email.toLowerCase(),
      role,
      companyId,
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
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
                    <SelectItem value={Role.OWNER}>{Role.OWNER}</SelectItem>
                    <SelectItem value={Role.MANAGER}>{Role.MANAGER}</SelectItem>
                    <SelectItem value={Role.CASHIER}>{Role.CASHIER}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription className="pt-2">
                Select your user&apos;s access level.
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
                <FormControl className="capitalize">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {companies.status === "success" &&
                      companies.data.map((company) => (
                        <SelectItem
                          value={company.id}
                          key={company.id}
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
        {upsertUser.isPending ? (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button disabled={upsertUser.isPending} type="submit" size="sm">
            Create User
          </Button>
        )}
      </form>
    </Form>
  )
}
