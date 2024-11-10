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
  useQuery as useTanstackQuery,
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

  const me = useTanstackQuery(convexQuery(api.users.me, {}))
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
        name={name}
        status={status}
        open={open}
        setOpen={setOpen}
      >
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
    <DeleteDrawer
      disabledBasedOnAccessLevel={!adminAccessLevel}
      name={name}
      status={status}
      open={open}
      setOpen={setOpen}
    >
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
  disabledBasedOnAccessLevel,
  name,
  status,
  open,
  setOpen,
  children,
}: {
  disabledBasedOnAccessLevel: boolean
  name: string
  status: Status
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={status === "enabled" || disabledBasedOnAccessLevel}
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
  disabledBasedOnAccessLevel,
  name,
  status,
  open,
  setOpen,
  children,
}: {
  disabledBasedOnAccessLevel: boolean
  name: string
  status: Status
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        disabled={status === "enabled" || disabledBasedOnAccessLevel}
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
