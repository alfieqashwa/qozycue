import { roles } from "@/app/constants/options"
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { upsertTeamSchema, type TUpsertTeam } from "@/types/schema/user-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateTeamForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const profile = useTanstackQuery(convexQuery(api.users.me, {}))

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.users.upsertAdminProcedure),
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: "Your new team has been created.",
      })
    },
    // source => https://docs.convex.dev/functions/error-handling/application-errors#throwing-application-errors
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const form = useForm<TUpsertTeam>({
    resolver: zodResolver(upsertTeamSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  })
  function onSubmit(values: TUpsertTeam) {
    const { email, role } = values
    // avoid user to input his / her own email.
    if (profile.data?.email === email) {
      return toast.error("Something went wrong.", {
        description: "Please DO NOT input your own email, Dude!",
      })
    }
    mutate({
      upsertUserSchema: {
        email: email.toLowerCase(),
        role,
        companyId: profile.data?.companyId,
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormLabel>Role</FormLabel>
                <FormControl className="w-[200px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* ADMIN CANNOT create a new team where the role is "ADMIN" */}
                  {profile.status === "success" &&
                  profile.data?.role === "ZENITH" ? (
                    <SelectGroup>
                      {roles
                        .filter((r) => r.value !== "ZENITH")
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
                          (r) => r.value !== "ZENITH" && r.value !== "ADMIN",
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
        <SheetFooter className="pt-8">
          <SheetClose
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "mt-1.5 md:mt-0",
            )}
          >
            Cancel
          </SheetClose>
          {isPending ? (
            <Button disabled>
              <Loader2 className="size-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button disabled={isPending} type="submit">
              Create Team
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
