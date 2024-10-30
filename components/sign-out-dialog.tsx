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
import { useAuthActions } from "@convex-dev/auth/react"
import { Power } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SignOutDialog() {
  const [open, setOpen] = useState(false)

  const { signOut } = useAuthActions()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut().then(() => router.push("/"))
  }

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
        <DialogDescription asChild>
          <p>
            Click
            <span className="px-1.5 font-medium text-primary">Sign Out</span>
            button when you&apos;re sure want to sign out
          </p>
        </DialogDescription>
        <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(!open)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
