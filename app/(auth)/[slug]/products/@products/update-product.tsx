"use client"

import { Pen } from "lucide-react"
import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
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
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type UpdateProductProps = {
  name: string
  children: React.ReactNode
}

export function UpdateProduct({ name, children }: UpdateProductProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const description = "Klik Update Product setelah selesai memperbarui form."

  if (isDesktop) {
    return (
      <Sheet>
        <SheetTrigger className="group flex w-full items-center py-1 pl-2 hover:bg-accent">
          <Pen className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
          <span className="text-sm">Edit</span>
        </SheetTrigger>

        <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
          <SheetHeader>
            <SheetTitle>
              Update Product{" "}
              <span className="capitalize text-primary">{name}</span>
            </SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <Drawer>
      <DrawerTrigger className="group flex w-full items-center py-1 pl-2 hover:bg-accent">
        <Pen className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span className="text-sm">Edit</span>
      </DrawerTrigger>

      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>
            Update Product{" "}
            <span className="capitalize text-primary">{name}</span>
          </DrawerTitle>
          <DrawerDescription className="text-balance">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
