import { Loader2, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"

type DeleteProductProps = {
  id: string
  name: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DESCRIPTION =
  "Anda tidak dapat membatalkan perubahan ini. Klik Delete Product untuk menghapus Produk"

export function DeleteProductForm({ id, name, setOpen }: DeleteProductProps) {
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.product.delete.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: `Product ${name.toUpperCase()} has been deleted.`,
      })
      await utils.company.subscriptions.invalidate()
      router.refresh()
      /* auto-closed after succeed submit the dialog form */
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate({ id })
  }

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <DeleteDialog name={name}>
        <form onSubmit={handleSubmit}>
          {isPending ? (
            <Button disabled variant="destructive">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" variant="destructive">
              Delete Product
            </Button>
          )}
        </form>
      </DeleteDialog>
    )
  }
  return (
    <DeleteDrawer name={name}>
      <form onSubmit={handleSubmit}>
        {isPending ? (
          <Button disabled variant="destructive" className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" variant="destructive" className="w-full">
            Delete Product
          </Button>
        )}
      </form>
    </DeleteDrawer>
  )
}

function DeleteDialog({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center">
        <Trash className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card pb-16">
        <DialogHeader>
          <DialogTitle>Are You Sure?</DialogTitle>
          <DialogDescription>
            {DESCRIPTION}
            <span className="px-1.5 font-medium uppercase text-primary">
              {name}.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pt-4 md:absolute md:bottom-4 md:right-4 md:px-0 md:pt-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDrawer({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) {
  return (
    <Drawer>
      <DrawerTrigger className="flex w-full items-center">
        <Trash className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span>Delete</span>
      </DrawerTrigger>

      <DrawerContent className="bg-card px-4 pb-4">
        <DrawerHeader>
          <DrawerTitle>Are You Sure?</DrawerTitle>
          <DrawerDescription>
            {DESCRIPTION}
            <span className="px-1.5 font-medium uppercase text-primary">
              {name}.
            </span>
          </DrawerDescription>
        </DrawerHeader>
        {children}
        <DialogFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DialogFooter>
      </DrawerContent>
    </Drawer>
  )
}
