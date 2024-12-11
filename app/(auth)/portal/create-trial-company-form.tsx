import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import {
  createTrialCompanySchema,
  TCreateTrialCompany,
} from "@/types/schema/company-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateTrialCompanyForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.companies.createTrial),
    onSuccess: () => {
      toast.success("Succeed!", {
        description: "Your company/tenant has been created.",
      })
      setOpen(false)
      router.push(
        `/${variables?.createTrialCompanySchema.name.replace(/ /g, "-")}/dashboard/`,
      )
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  // 1. Define form.
  const form = useForm<TCreateTrialCompany>({
    resolver: zodResolver(createTrialCompanySchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
    },
  })

  // 2. Define a submit handler
  function onSubmit(values: TCreateTrialCompany) {
    const { name, phone, location } = values
    // Do something with the form values.
    // This will b type-safe and validated.
    mutate({
      createTrialCompanySchema: {
        name: name.toLowerCase(),
        phone,
        location: location.toLowerCase(),
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="pt-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} className="capitalize" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Location"
                  {...field}
                  className="capitalize"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isPending ? (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button disabled={isPending} type="submit">
            Submit
          </Button>
        )}
      </form>
    </Form>
  )
}
