import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Status } from "@/types"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQueries as useTanstackQueries,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { toast } from "sonner"

const DeleteDialog = dynamic(() => import("./delete-product-dialog.tsx"), {
  ssr: false,
})
const DeleteDrawer = dynamic(() => import("./delete-product-drawer.tsx"), {
  ssr: false,
})

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
    (me.data?.role === "ZENITH" || me.data?.role === "ADMIN")

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
  const DESCRIPTION = `You can&apos;t undo this changes. Click Delete Product when
            you&apos;re sure to delete`

  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) {
    return (
      <DeleteDialog
        disabledBasedOnAccessLevel={!adminAccessLevel}
        hasProductId={
          orderline.status === "success" && Boolean(orderline?.data?._id) // if there's orderline data, cannot delete
        }
        description={DESCRIPTION}
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
      description={DESCRIPTION}
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
