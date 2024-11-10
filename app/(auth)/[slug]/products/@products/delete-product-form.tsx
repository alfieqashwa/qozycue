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
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Trash } from "lucide-react"
import { toast } from "sonner"

const DESCRIPTION =
  "You can&apos;t undo this changes. Click Delete Product when you&apos;re sure to delete Product"

type DeleteProductProps = {
  id: Id<"products">
  name: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export function DeleteProductForm({ id, name, setOpen }: DeleteProductProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.products.remove),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: `Product ${name.toUpperCase()} has been deleted.`,
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
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
