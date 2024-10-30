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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetFooter } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Subscription } from "@/types"
import {
  updateCompanyDewaSchema,
  type TUpdateCompanyDewa,
} from "@/types/schema/company-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function UpdateCompanyForm({
  id,
  name,
  phone,
  location,
  isPublished,
  subscription,
  setOpen,
}: {
  id: Id<"companies">
  name: string
  phone: string
  location: string
  isPublished: boolean
  subscription: Subscription
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.update),
    onSuccess() {
      toast.success("Succeed!", {
        description: "The company has been updated.",
      })
    },
    onError(err) {
      toast.error("Something went wrong!", {
        description: err.message || "There was a problem with your request.",
      })
    },
    onSettled() {
      /* auto-closed the dialog form whether submitting has succeeded or thrown an error  */
      router.refresh()
      setOpen(false)
    },
  })

  // 1. Define form.
  const form = useForm<TUpdateCompanyDewa>({
    resolver: zodResolver(updateCompanyDewaSchema),
    defaultValues: {
      id,
      name,
      phone,
      location,
      isPublished,
      subscription,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TUpdateCompanyDewa) {
    const { name, phone, location, isPublished, subscription } = values

    mutate({
      updateCompanyDewaSchema: {
        id,
        name: name.toLowerCase(),
        phone,
        location: location.toLowerCase(),
        isPublished,
        subscription,
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
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
                <Input type="number" placeholder="phone" {...field} />
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
                <Textarea placeholder="location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex items-end justify-between">
              <FormLabel>Published?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  // disabled
                  // aria-readonly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"TRIAL"}>TRIAL</SelectItem>
                  <SelectItem value={"BASIC"}>BASIC</SelectItem>
                  <SelectItem value={"PRO"}>PRO</SelectItem>
                  <SelectItem value={"ENTERPRISE"}>ENTERPRISE</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className="absolute bottom-4 left-0 right-0 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="mt-1.5 sm:mt-0"
          >
            Cancel
          </Button>
          {isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button disabled={isPending} type="submit">
              Update Company
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
