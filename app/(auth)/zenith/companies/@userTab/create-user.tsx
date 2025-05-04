import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { User2 } from "lucide-react"
import { useState } from "react"
import { CreateUserForm } from "./create-user-form"

export function CreateUser() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={cn(buttonVariants(), "ml-0 md:ml-2")}>
        <User2 />
        Create User
      </SheetTrigger>

      <SheetContent className="bg-card min-w-full px-4 sm:min-w-[480px]">
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
