import { Button, buttonVariants } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { cn } from "@/lib/utils"
import {
  createTrialCompanySchema,
  TCreateTrialCompany,
} from "@/types/schema/company-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import Image from "next/image"
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
      setOpen(false)
      toast.success("Succeed!", {
        description: "Your company / tenant has been created.",
      })
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
      countryCode: "",
      location: "",
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
  function onSubmit(values: TCreateTrialCompany) {
    const { name, phone, location, countryCode } = values

    mutate({
      createTrialCompanySchema: {
        name: name.toLowerCase(),
        phone: phone.trim(),
        countryCode,
        location: location.toLowerCase(),
      },
    })
  }

  return (
    <ScrollArea className="h-[calc(100vh_-_12rem)] lg:h-[calc(100vh_-_35rem)]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-2">
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
                            alt={c.country}
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
          <DialogFooter className="mt-16 flex flex-col-reverse md:flex-row md:items-center md:justify-end md:gap-4">
            <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </DialogClose>
            {isPending ? (
              <Button disabled size="sm">
                <Loader2 className="size-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button disabled={hasCompanyName || isPending} type="submit">
                Submit
              </Button>
            )}
          </DialogFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
