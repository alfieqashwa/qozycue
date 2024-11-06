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
          className="ml-2 h-8 whitespace-nowrap"
        >
          <FilePlus2 className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </SheetTrigger>

      <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
        <SheetHeader>
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
