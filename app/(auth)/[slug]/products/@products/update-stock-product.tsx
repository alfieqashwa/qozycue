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
import { Input } from "@/components/ui/input"
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { getStockBackgroundColor } from "@/lib/getStockBackgroundColor"
import { cn } from "@/lib/utils"
import { Status } from "@/types"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { useState } from "react"
import { toast } from "sonner"

export function UpdateStockProduct({
  id,
  name,
  status,
  isStockable,
  countInStock,
  colorBasedOnCategory,
}: {
  id: Id<"products">
  name: string
  status: Status
  isStockable: boolean
  countInStock: number
  colorBasedOnCategory: string
}) {
  const [stock, setStock] = useState(countInStock)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.products.updateCountInStock),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Stock has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occured.",
      }),
  })

  return (
    <section className={cn(isStockable ? "" : "hidden")}>
      <Dialog>
        <WrapperTooltip content="Update Stock" side="left">
          <DialogTrigger
            disabled={status === "enabled"}
            className={cn(
              getStockBackgroundColor(stock),
              buttonVariants({ variant: "secondary" }),
              colorBasedOnCategory,
              "flex size-9 items-center justify-center shadow-md hover:cursor-pointer disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100",
              getStockBackgroundColor(stock),
            )}
          >
            <span className="">{countInStock}</span>
          </DialogTrigger>
        </WrapperTooltip>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Update Stock{" "}
              <span className={cn(colorBasedOnCategory, "capitalize")}>
                {name}
              </span>
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutate({
                id,
                updatedStock: stock,
              })
            }}
            className="mt-4 flex items-center justify-between"
          >
            <Input
              id="stock"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-[80px]"
            />
            <DialogFooter>
              <Button
                disabled={isPending}
                type="submit"
                size={"sm"}
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
