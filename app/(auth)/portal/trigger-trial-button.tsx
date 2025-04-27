"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { CreateTrialCompanyForm } from "./create-trial-company-form"

export function TriggerTrialButton({ userRole }: { userRole: boolean }) {
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const title = "Trial Subscription"
  const description =
    "You have max of 10 pool tables, 20 products, 6 packets, and 5 users."

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          disabled={!userRole}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "mx-2 font-semibold tracking-widest uppercase",
          )}
        >
          Trial
        </DialogTrigger>
        <DialogContent className="p-8">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <CreateTrialCompanyForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        disabled={!userRole}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "mx-2 font-semibold tracking-widest uppercase",
        )}
      >
        Trial
      </DrawerTrigger>
      <DrawerContent className="min-h-[calc(100vh_-_5rem)] px-4 py-2">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <CreateTrialCompanyForm setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  )
}
