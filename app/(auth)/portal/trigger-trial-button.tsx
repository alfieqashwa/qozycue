"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react"
import { CreateTrialCompanyForm } from "./create-trial-company-form"

export function TriggerTrialButton({ userRole }: { userRole: boolean }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const buttonTitle = "trial"
  const title = "Trial Subscription"
  const description =
    "You have max of 10 pool tables, 20 products, 6 packets, and 5 users."

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!userRole}
            variant="secondary"
            size="sm"
            className="mx-2 animate-bounce font-semibold uppercase tracking-widest disabled:pointer-events-auto disabled:cursor-not-allowed"
          >
            {buttonTitle}
          </Button>
        </DialogTrigger>
        <DialogContent>
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
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="mx-2 animate-bounce font-semibold uppercase tracking-widest"
        >
          {buttonTitle}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <CreateTrialCompanyForm setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  )
}
