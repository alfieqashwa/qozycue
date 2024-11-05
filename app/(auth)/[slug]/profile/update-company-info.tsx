import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"
import {
  type TUpdateCompanyAdmin,
  updateCompanyAdminSchema,
} from "@/types/schema/company-schema"

export function UpdateCompanyInfo({
  isAdmin,
  companyId,
  phone,
  location,
  className,
}: {
  isAdmin: boolean
  companyId: string
  phone: string
  location: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  const utils = api.useUtils()
  const { mutate, isPending } = api.company.updateAdmin.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Create new order.",
      })
      await utils.user.find.invalidate()
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

  const form = useForm<TUpdateCompanyAdmin>({
    resolver: zodResolver(updateCompanyAdminSchema),
    defaultValues: {
      id: companyId,
      phone,
      location,
    },
  })

  function onSubmit(values: TUpdateCompanyAdmin) {
    const { phone, location } = values

    mutate({
      id: companyId,
      phone,
      location: location.toLowerCase(),
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
