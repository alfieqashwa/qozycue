import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { CreateTeamForm } from "./create-team-form"

export function CreateTeam() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 whitespace-nowrap md:ml-2"
        >
          <FilePlus2 className="text-primary size-4" />
          Create Team
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-card min-w-full sm:min-w-[480px]">
        <SheetHeader className="mt-4 px-6 text-center md:text-left">
          <SheetTitle>Create New Team</SheetTitle>
          <SheetDescription>
            Click <b>Create Team</b> when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateTeamForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
