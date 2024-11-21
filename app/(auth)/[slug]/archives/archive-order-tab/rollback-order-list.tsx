import { Loader2, RefreshCcwDot } from "lucide-react"
import { useState } from "react"
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"

import { type Table } from "@tanstack/react-table"
import { type RouterOutputs } from "@/trpc/react"

interface RollbackOrderListProps<TData> {
  table: Table<TData>
  disabledBasedOnAccessLevel: boolean
}

export function RollbackOrderList<TData>({
  table,
  disabledBasedOnAccessLevel,
}: RollbackOrderListProps<TData>) {
  const [open, setOpen] = useState(false)

  const utils = api.useUtils()
  const { toast } = useToast()

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map(
      (row) => row.original,
    ) as RouterOutputs["order"]["findAllByCompanyId"]

  const selectedOrders = selectedRows.map((row) => ({
    id: row.id,
  }))

  const { mutate, isPending } = api.order.rollbackSelected.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "All selected order(s) have been rolled back.",
      })
      await utils.order.invalidate()
      table.resetRowSelection() // reset row selection after succeed
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    mutate({ selectedOrders })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          disabled={disabledBasedOnAccessLevel}
          className="ml-2 h-8 whitespace-nowrap bg-amber-600 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <RefreshCcwDot className="mr-2 h-4 w-4" />
          Rollback Selected ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                Anda tidak dapat membatalkan perubahan ini. Klik Rollback All
                untuk mengembalikan order yang dipilih ke Table Transactions.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isPending ? (
              <Button disabled variant="destructive" size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                className="bg-amber-600"
              >
                Rollback All
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
