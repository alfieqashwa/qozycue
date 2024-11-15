import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { ArrowRightLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function TransferTable({
  isCashier,
  orderId,
  poolTableIdFrom,
  poolTableName,
  startTime,
  endTime,
  setOpenDetailDrawer,
}: {
  isCashier: boolean
  orderId: Id<"orders">
  poolTableIdFrom: Id<"poolTables">
  poolTableName: string
  startTime: number | undefined
  endTime: number | undefined
  poolRentalId: Id<"poolRentals">
  setOpenDetailDrawer: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [open, setOpen] = useState(false)

  const { data: transferPoolTableList, status } = useQuery({
    ...convexQuery(api.pooltables.transferPoolTableList, { poolTableIdFrom }),
    enabled: Boolean(poolTableIdFrom),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.pooltables.transfer),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "The table has been transfered successfully.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => {
      setOpenDetailDrawer(false)
      setOpen(false)
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const poolTableIdTo = formData.get("poolTableIdTo") as Id<"poolTables">

    mutate({
      orderId,
      poolTableIdFrom,
      poolTableIdTo,
      startTime: startTime as number,
      endTime: endTime as number,
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={!isCashier || !transferPoolTableList?.length}
        className={cn(
          "pr-2 text-muted-foreground disabled:pointer-events-auto disabled:cursor-not-allowed",
          isCashier &&
            "transition-colors duration-300 ease-in-out hover:text-foreground",
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <ArrowRightLeft size={20} />
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-muted text-muted-foreground"
          >
            Transfer Table ?
          </TooltipContent>
        </Tooltip>
      </SheetTrigger>
      <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
        {status === "success" && (
          <pre>{JSON.stringify(transferPoolTableList, null, 2)}</pre>
        )}
        <SheetHeader>
          <SheetTitle>Transfer Table {poolTableName}</SheetTitle>
          <SheetDescription>Click Transfer when you're ready.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-8">
          <Select name="poolTableIdTo">
            <SelectTrigger className="w-[180px] capitalize">
              <SelectValue placeholder="Select Table" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {status === "success" &&
                  transferPoolTableList?.map((t) => (
                    <SelectItem
                      value={t._id}
                      className="capitalize"
                      key={t._id}
                    >
                      Table {t.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <SheetFooter className="pt-16">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                Transfer
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
