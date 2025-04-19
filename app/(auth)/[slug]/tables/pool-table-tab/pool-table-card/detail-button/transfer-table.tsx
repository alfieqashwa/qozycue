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
import { Rate } from "@/types"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { ArrowRightLeft, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function TransferTable({
  isCashier,
  isManager,
  orderId,
  packetRate,
  duration,
  poolTableIdFrom,
  poolTableName,
  startTime,
  endTime,
  setOpenDetailDrawer,
}: {
  isCashier: boolean
  isManager: boolean
  orderId: Id<"orders">
  packetRate?: Rate
  duration?: number
  poolTableIdFrom: Id<"poolTables">
  poolTableName: string
  startTime: number
  endTime: number | null
  poolRentalId: Id<"poolRentals">
  setOpenDetailDrawer: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [selectedTableId, setSelectedTableId] = useState<Id<"poolTables"> | "">(
    "",
  )
  const [open, setOpen] = useState(false)

  const { data: transferPoolTableList, status } = useQuery({
    ...convexQuery(api.poolTables.transferPoolTableList, { poolTableIdFrom }),
    enabled: Boolean(poolTableIdFrom),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.poolTables.transfer),
    onSuccess: () => {
      setOpenDetailDrawer(false)
      setOpen(false)
      setSelectedTableId("") // <- reset selected tableId
      toast.success("Succeed!", {
        description: "The table has been transfered successfully.",
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedTableId) return // just an extra guard, though the button is disabled already

    mutate({
      orderId,
      poolTableIdFrom,
      poolTableIdTo: selectedTableId,
      packetRate: packetRate as Rate,
      duration: duration as number,
      startTime: startTime as number,
      endTime: endTime,
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={(!isCashier && !isManager) || !transferPoolTableList?.length}
        className={cn(
          "text-muted-foreground pr-2 disabled:pointer-events-auto disabled:cursor-not-allowed",
          (isCashier || isManager) &&
            "hover:text-foreground transition-colors duration-300 ease-in-out",
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
      <SheetContent className="bg-card min-w-full p-2 sm:min-w-[480px]">
        {/* {status === "success" && (
          <pre>{JSON.stringify(transferPoolTableList, null, 2)}</pre>
        )} */}
        <SheetHeader>
          <SheetTitle>Transfer Table {poolTableName}</SheetTitle>
          <SheetDescription>
            Click Transfer when you&apos;re ready.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-8">
          <Select
            name="poolTableIdTo"
            value={selectedTableId}
            onValueChange={(value) =>
              setSelectedTableId(value as Id<"poolTables">)
            }
          >
            <SelectTrigger className="ml-4 w-[180px] capitalize">
              <SelectValue placeholder="Select Table" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {status === "success" &&
                  transferPoolTableList?.map((t) => (
                    <SelectItem
                      value={t._id}
                      className="capitalize hover:cursor-pointer"
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
            <Button
              disabled={!selectedTableId || isPending}
              type="submit"
              className="disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Transfer"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
