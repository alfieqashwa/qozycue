"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Id } from "@/convex/_generated/dataModel"
import { Subscription } from "@/types"
import { Pen } from "lucide-react"
import { useState } from "react"
import { UpdateCompanyForm } from "./update-company-form"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

type UpdateCompanyProps = {
  id: Id<"companies">
  name: string
  phone: string
  location: string
  countryCode: string
  subscription: Subscription
}

export function UpdateCompany({
  id,
  name,
  phone,
  location,
  countryCode,
  subscription,
}: UpdateCompanyProps) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants(),
          "diabled:cursor-not-allowed disabled:pointer-events-auto",
        )}
      >
        <Pen />
        <span>Edit</span>
      </SheetTrigger>

      <SheetContent className="bg-card min-w-full p-4 sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Update Company</SheetTitle>
          <SheetDescription>
            Edit
            <span className="text-primary px-1.5 font-medium uppercase">
              {name}
            </span>
            here. Click <b>Update Company</b> when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <UpdateCompanyForm
          id={id}
          name={name}
          phone={phone}
          subscription={subscription}
          location={location}
          countryCode={countryCode}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  )
}
