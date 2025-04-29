import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { cn } from "@/lib/utils"
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
    <WrapperTooltip content={contentText}>
      <DialogTrigger
        disabled={disabled}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        {title}
      </DialogTrigger>
    </WrapperTooltip>
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
