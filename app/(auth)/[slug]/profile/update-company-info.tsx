import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import {
  TUpdateCompanyByAdmin,
  updateCompanyByAdminSchema,
} from "@/types/schema/company-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function UpdateCompanyInfo({
  isAdmin,
  companyId,
  phone,
  location,
  className,
}: {
  isAdmin: boolean
  companyId: Id<"companies">
  phone: string
  location: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.updateByAdmin),
    async onSuccess() {
      toast("Succeed!", {
        description: "Create new order.",
      })
    },
    onError(err) {
      toast.error("Something went wrong.", {
        description: err.message || "There was a problem with your request.",
      })
    },
    onSettled() {
      setOpen(false)
    },
  })

  const form = useForm<TUpdateCompanyByAdmin>({
    resolver: zodResolver(updateCompanyByAdminSchema),
    defaultValues: {
      id: companyId,
      phone,
      location,
    },
  })

  function onSubmit(values: TUpdateCompanyByAdmin) {
    const { phone, location } = values

    mutate({
      updateCompanyByAdminSchema: {
        id: companyId,
        phone,
        location: location.toLowerCase(),
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isPending || !isAdmin}
          className={cn(
            "disabled:pointer-events-auto disabled:cursor-not-allowed",
            className,
          )}
        >
          <Pencil size={14} className="mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
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
            <DialogFooter className="flex flex-row items-center justify-end pt-8">
              <DialogClose asChild>
                <Button variant="secondary" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              {isPending ? (
                <Button
                  disabled
                  size="sm"
                  className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" size="sm">
                  Update Company
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
