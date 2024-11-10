"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Status } from "@/types"
import { Pen } from "lucide-react"
import { useState } from "react"
import { UpdateProductForm } from "./update-product-form"

type UpdateProductProps = {
  id: Id<"products">
  name: string
  costPrice: number
  salePrice: number
  status: Status
  categoryId: Id<"categories">
  unitOfMeasureId: Id<"unitOfMeasures">
}
export function UpdateProduct({
  id,
  name,
  costPrice,
  salePrice,
  status,
  categoryId,
  unitOfMeasureId,
}: UpdateProductProps) {
  const [open, setOpen] = useState(false)
  const description = "Click Update Product when you're sure to delete"

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          disabled={status === "enabled"}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "flex w-full items-center",
          )}
        >
          <Pen className="mr-2 h-4 w-4" />
          <span className="text-sm">Edit</span>
        </SheetTrigger>

        <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
          <SheetHeader>
            <SheetTitle>Update Product</SheetTitle>
            <SheetDescription>
              {description}
              <span className="pl-1 uppercase text-primary">{name}</span>.
            </SheetDescription>
          </SheetHeader>
          <UpdateProductForm
            id={id}
            name={name}
            costPrice={costPrice}
            salePrice={salePrice}
            categoryId={categoryId}
            unitOfMeasureId={unitOfMeasureId}
            setOpen={setOpen}
          />

          <SheetFooter className="px-4 pt-4 md:absolute md:bottom-4 md:right-44 md:px-0 md:pt-0">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        disabled={status === "enabled"}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex w-full items-center",
        )}
      >
        <Pen className="mr-2 h-4 w-4" />
        <span className="text-sm">Edit</span>
      </DrawerTrigger>

      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>Update Product</DrawerTitle>
          <DrawerDescription className="text-balance">
            {description}
            <span className="pl-1 capitalize text-primary">{name}</span>.
          </DrawerDescription>
        </DrawerHeader>
        <UpdateProductForm
          id={id}
          name={name}
          costPrice={costPrice}
          salePrice={salePrice}
          categoryId={categoryId}
          unitOfMeasureId={unitOfMeasureId}
          setOpen={setOpen}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
