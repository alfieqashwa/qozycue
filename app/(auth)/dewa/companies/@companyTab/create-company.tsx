import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { CreateCompanyForm } from "./create-company-form"

export function CreateCompany() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="ml-2 h-8 whitespace-nowrap"
        >
          Create Company
        </Button>
      </SheetTrigger>

      <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Create New Company</SheetTitle>
          <SheetDescription>
            Create new company here. Click Create Company when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateCompanyForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
