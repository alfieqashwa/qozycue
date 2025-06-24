"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Building2, Loader2, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateTrialCompanyForm() {
  const router = useRouter()

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.companies.createTrial),
    onSuccess: () => {
      toast.success("Succeed!", {
        description: "Your company / tenant has been created.",
      })
      form.reset() // <-- fix(bug): the `hasCompanyName` will not show in submitting process.
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

  const form = useForm<TCreateTrialCompany>({
    resolver: zodResolver(createTrialCompanySchema),
    defaultValues: {
      name: "",
      phone: "",
      countryCode: "",
      location: "",
    },
  })

  const { data: hasCompanyName } = useTanstackQuery({
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
    <Card className="bg-card w-full max-w-md border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Company Information
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Please enter your company details below
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="pt-4">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl className="relative">
                    <div>
                      <Building2
                        className={cn(
                          "absolute top-1.5 left-3 h-5 w-5",
                          form.watch("name").length >= 3
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                      <Input
                        placeholder="max 25 chars"
                        {...field}
                        className="pl-10 capitalize"
                      />
                    </div>
                  </FormControl>
                  <p className="text-destructive">
                    {hasCompanyName &&
                      "Duplicate name! Please add another name."}
                  </p>
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
                    <div className="relative">
                      <Phone
                        className={cn(
                          "absolute top-1.5 left-3 h-5 w-5",
                          form.watch("phone").length === 11
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      />

                      <Input
                        type="tel"
                        placeholder="Phone"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <FormControl>
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
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin
                        className={cn(
                          "absolute top-1.5 left-3 h-5 w-5",
                          form.watch("location").length >= 10
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                      <Textarea
                        placeholder="Location"
                        {...field}
                        className="h-[120px] w-[290px] pl-10 capitalize md:w-[390px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              disabled={hasCompanyName || isPending}
              type="submit"
              className="w-full disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Please wait</span>
                </>
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
