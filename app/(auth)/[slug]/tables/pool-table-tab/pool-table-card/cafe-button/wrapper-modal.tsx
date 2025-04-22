import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PrintTooltip } from "./print-tooltip"
import { DialogDescription } from "@radix-ui/react-dialog"

export const WrapperDialog = ({
  contentText,
  title,
  disabled,
  onCloseAutoFocus,
  children,
}: {
  contentText: string
  title: string
  disabled: boolean
  onCloseAutoFocus: () => void
  children: React.ReactNode
}) => (
  <Dialog>
    <PrintTooltip contentText={contentText}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          variant="secondary"
          size="sm"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          {title}
        </Button>
      </DialogTrigger>
    </PrintTooltip>
    <DialogHeader>
      <DialogTitle />
      <DialogDescription />
    </DialogHeader>
    <DialogContent onCloseAutoFocus={onCloseAutoFocus} className="bg-card">
      <DialogHeader>
        <DialogTitle>{title}?</DialogTitle>
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
)
