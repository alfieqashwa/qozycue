import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"
import { Status } from "@/types"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQueries as useTanstackQueries,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const DESCRIPTION =
  "You can't undo this changes. Click Delete Product when you're sure to delete"

type DeleteProductProps = {
  id: Id<"products">
  name: string
  status: Status
}
export function DeleteProductForm({ id, name, status }: DeleteProductProps) {
  const [open, setOpen] = useState(false)

  const [me, orderline] = useTanstackQueries({
    queries: [
      convexQuery(api.users.me, {}),
      {
        ...convexQuery(api.orderlines.findByProductId, { productId: id }),
        enabled: Boolean(id),
      },
    ],
  })

  const adminAccessLevel =
    me.status === "success" &&
    (me.data?.role === "DEWA" || me.data?.role === "ADMIN")

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
    mutate({ deleteProductSchema: { id } })
  }

  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) {
    return (
      <DeleteDialog
        disabledBasedOnAccessLevel={!adminAccessLevel}
        hasProductId={
          orderline.status === "success" && Boolean(orderline?.data?._id) // if there's orderline data, cannot delete
        }
        name={name}
        status={status}
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={handleSubmit}>
          {isPending ? (
            <Button disabled variant="destructive">
              <Loader2 className="size-4 animate-spin" />
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
    <DeleteDrawer
      disabledBasedOnAccessLevel={!adminAccessLevel}
      hasProductId={Boolean(orderline?.data?._id)}
      name={name}
      status={status}
      open={open}
      setOpen={setOpen}
    >
      <form onSubmit={handleSubmit}>
        {isPending ? (
          <Button disabled variant="destructive" className="w-full">
            <Loader2 className="size-4 animate-spin" />
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
  disabledBasedOnAccessLevel,
  hasProductId,
  name,
  status,
  open,
  setOpen,
  children,
}: {
  disabledBasedOnAccessLevel: boolean
  hasProductId: boolean
  name: string
  status: Status
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={
          status === "enabled" || disabledBasedOnAccessLevel || hasProductId
        }
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash className="mr-2 h-4 w-4" />
        <span className="text-sm">Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card pb-16">
        <DialogHeader>
          <DialogTitle>Are You Sure?</DialogTitle>
          <DialogDescription>
            {DESCRIPTION}
            <span className="text-primary px-1.5 font-medium uppercase">
              {name}.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pt-4 md:absolute md:right-4 md:bottom-4 md:px-0 md:pt-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDrawer({
  disabledBasedOnAccessLevel,
  hasProductId,
  name,
  status,
  open,
  setOpen,
  children,
}: {
  disabledBasedOnAccessLevel: boolean
  hasProductId: boolean
  name: string
  status: Status
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        disabled={
          status === "enabled" || disabledBasedOnAccessLevel || hasProductId
        }
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash className="mr-2 h-4 w-4" />
        <span className="text-sm">Delete</span>
      </DrawerTrigger>

      <DrawerContent className="bg-card px-4 pb-4">
        <DrawerHeader>
          <DrawerTitle>Are You Sure?</DrawerTitle>
          <DrawerDescription>
            {DESCRIPTION}
            <span className="text-primary px-1.5 font-medium uppercase">
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
