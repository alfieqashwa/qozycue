import { ArrowRightLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { ToastAction } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ConvexError } from "convex/values"

export function TransferTable({
  // isCashier,
  orderId,
  poolTableIdFrom,
  poolTableName,
  startTime,
  endTime,
  setOpenDetailDrawer,
}: {
  // isCashier: boolean
  orderId: Id<"orders">
  poolTableIdFrom: Id<"poolTables">
  poolTableName: string
  startTime: number | undefined
  endTime: number | undefined
  poolRentalId: Id<"poolRentals">
  setOpenDetailDrawer: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [open, setOpen] = useState(false)

  const { data: transferPoolTableList, status } =
    api.poolTable.transferPoolTableList.useQuery(
      { poolTableIdFrom },
      {
        enabled: Boolean(poolTableIdFrom),
        select(data) {
          return data.sort((p, q) =>
            p.name.localeCompare(q.name, undefined, { numeric: true }),
          )
        },
      },
    )

  const { mutate, isPending } = api.order.transfer.useMutation({
    async onSuccess() {
      /* auto-closed after succeed submit the dialog form */
      setOpenDetailDrawer(false)
      setOpen(false)
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

    const formData = new FormData(e.currentTarget)
    const poolTableIdTo = formData.get("poolTableIdTo") as string

    mutate({
      orderId,
      poolTableIdFrom,
      poolTableIdTo,
      startTime,
      endTime,
    })
  }

  const isCashier = true
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
                    <SelectItem value={t.id} className="capitalize" key={t.id}>
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
