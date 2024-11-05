import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CreateUserForm } from "./create-user-form"

export function CreateUser() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="ml-2 h-8 whitespace-nowrap"
        >
          Create User
        </Button>
      </SheetTrigger>

      <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Create New User</SheetTitle>
          <SheetDescription>
            Click <b>Create User</b> when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateUserForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
