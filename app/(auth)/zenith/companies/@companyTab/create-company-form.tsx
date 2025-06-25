import { SubmitButton } from "@/components/submit-button"
import { buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { cn } from "@/lib/utils"
import {
  createCompanySchema,
  type TCreateCompany,
} from "@/types/schema/company-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateCompanyForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.create),
    onSuccess: () => {
      toast.success("Succeed!", {
        description: "Your new company has been created.",
      })
      form.reset() // <-- fix(bug): the `hasCompanyName` will not show in submitting process.
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  // 1. Define form.
  const form = useForm<TCreateCompany>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      phone: "",
      countryCode: "",
      location: "",
      isPublished: false,
    },
  })

  const { data: hasCompanyName, status: hasCompanyNameStatus } =
    useTanstackQuery({
      ...convexQuery(api.companies.findAll, {}),
      select(data) {
        return data.some((c) => c.name === form.watch("name").toLowerCase())
      },
    })

  // 2. Define a submit handler
  function onSubmit(values: TCreateCompany) {
    const { name, phone, location, isPublished, countryCode } = values

    mutate({
      createCompanySchema: {
        name: name.toLowerCase(),
        phone: phone.trim(),
        location: location.toLowerCase(),
        countryCode,
        isPublished,
      },
    })
  }

  return (
    <ScrollArea className="h-[calc(100vh_-_7rem)] px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {hasCompanyNameStatus === "success" && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="pt-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      {...field}
                      className="capitalize md:w-[280px]"
                    />
                  </FormControl>
                  <p className="text-destructive text-sm">
                    {hasCompanyName &&
                      "Duplicate name! Please add another name."}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("name").length >= 3 && (
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Phone"
                      {...field}
                      className="w-[180px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("phone").length >= 11 && (
            <FormField
              control={form.control}
              name="countryCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-[280px]">
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries?.map((c, i) => (
                        <SelectItem value={c.code} key={`${c.code}-${i}`}>
                          <Image
                            src={c.flag}
                            alt={c.country ?? "Flag"}
                            width={300}
                            height={150}
                            className="flex h-4 w-6 items-center"
                          />
                          <span className="font-medium">{c.country}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!!form.watch("countryCode") && (
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
                      className="h-[120px] capitalize"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {form.watch("location").length <= 10 && (
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <SheetFooter className="mt-16 flex flex-col-reverse md:flex-row md:justify-end md:space-x-2">
            <SheetClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </SheetClose>
            <SubmitButton
              title="Create Company"
              isPending={isPending}
              disabled={hasCompanyName}
            />
          </SheetFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
