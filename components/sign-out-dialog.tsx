"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Power } from "lucide-react"
import { useState } from "react"
import { SignOutButton } from "./sign-button"

export function SignOutDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex w-full justify-between rounded-sm px-2 py-1.5 text-sm capitalize text-muted-foreground hover:cursor-pointer hover:bg-accent hover:text-foreground">
        sign out
        <Power size={18} className="shrink-0 text-red-700" />
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Are You Sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Click <b>Sign Out</b> button when you&apos;re sure want to sign out.
        </DialogDescription>
        <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(!open)}>
            Cancel
          </Button>
          <SignOutButton variant="destructive" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
