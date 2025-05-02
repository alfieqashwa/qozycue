import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { type ICountry } from "@/types"
import {
  TUpdateCompanyByAdmin,
  updateCompanyByAdminSchema,
} from "@/types/schema/company-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Pencil } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type UpdateCompanyInfoProps = {
  adminAccessLevel: boolean
  countries: ICountry[]
  companyId: Id<"companies">
  phone: string
  location: string
  countryCode: string
  className?: string
}

export function UpdateCompanyInfo({
  adminAccessLevel,
  countries,
  companyId,
  phone,
  location,
  countryCode,
  className,
}: UpdateCompanyInfoProps) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.updateAdminProcedure),
    onSuccess: () =>
      toast("Succeed!", {
        description: "Create new order.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TUpdateCompanyByAdmin>({
    resolver: zodResolver(updateCompanyByAdminSchema),
    defaultValues: {
      id: companyId,
      phone,
      location,
      countryCode,
    },
  })

  function onSubmit(values: TUpdateCompanyByAdmin) {
    const { phone, location, countryCode } = values

    mutate({
      updateCompanyByAdminSchema: {
        id: companyId,
        phone: phone.trim(),
        location: location.toLowerCase(),
        countryCode,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={isPending || !adminAccessLevel}
        className={cn(
          buttonVariants(),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
          className,
        )}
      >
        <Pencil size={14} />
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Click <b>Update Company</b> when you&apos;re done
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      className="w-[200px]"
                      {...field}
                    />
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
                      className="min-h-32 capitalize"
                    />
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
            <DialogFooter className="flex flex-row items-center justify-end pt-8">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              {isPending ? (
                <Button
                  disabled
                  className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">Update Company</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
