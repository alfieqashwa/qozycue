import { Loader2, Trash } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { type RouterOutputs } from "@/trpc/react"

interface DeletePacketListProps<TData> {
  table: Table<TData>
  disabledBasedOnAccessLevel: boolean
}

export function DeletePacketList<TData>({
  table,
  disabledBasedOnAccessLevel,
}: DeletePacketListProps<TData>) {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map(
      (row) => row.original,
    ) as RouterOutputs["product"]["findAllByCompanyId"]

  const ids = selectedRows.map((row) => ({
    id: row.id,
  }))

  const { mutate, isPending } = api.packet.deleteSelected.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "All selected packet(s) have been deleted.",
      })
      router.refresh()
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
    mutate({ ids })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabledBasedOnAccessLevel}
          className="ml-2 h-8 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                Anda tidak dapat membatalkan perubahan ini. Klik Delete All
                untuk menghapus paket yang dipilih.
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
              <Button type="submit" variant="destructive" size="sm">
                Delete All
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
