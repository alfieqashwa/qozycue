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
import { Building2 } from "lucide-react"
import { useState } from "react"
import { CreateCompanyForm } from "./create-company-form"

export function CreateCompany() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={cn(buttonVariants(), "ml-0 md:ml-2")}>
        <Building2 />
        Create Company
      </SheetTrigger>

      <SheetContent className="bg-card min-w-full px-4 sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Create New Company</SheetTitle>
          <SheetDescription>
            Click <b>Create Company</b> when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateCompanyForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
