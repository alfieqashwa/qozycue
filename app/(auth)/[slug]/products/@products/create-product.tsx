"use client"

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
import { CreateProductForm } from "./create-product-form"

export function CreateProduct({
  disabledBasedOnAccessLevel,
}: {
  disabledBasedOnAccessLevel: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          disabled={disabledBasedOnAccessLevel}
          className="whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FilePlus2 className="text-primary size-4" />
          Create Product
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card min-w-full px-8 py-4 sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Create New Product</SheetTitle>
          <SheetDescription>
            Click <b>Create Product</b> when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateProductForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
