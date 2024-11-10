import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Pen } from "lucide-react"

type UpdatePacketProps = {
  name: string
  children: React.ReactNode
}
export function UpdatePacket({ name, children }: UpdatePacketProps) {
  return (
    <Sheet>
      <SheetTrigger className="group flex w-full items-center py-1 pl-2 hover:bg-accent">
        <Pen className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span className="text-sm">Edit</span>
      </SheetTrigger>

      <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Update Packet</SheetTitle>
          <SheetDescription>
            Edit Packet
            <span className="px-1.5 font-medium uppercase text-primary">
              {name}
            </span>
            . Click <b>Update Packet</b> when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
