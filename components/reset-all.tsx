"use client"

import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "./ui/button"

export function ResetAll() {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.resetAll),
    onSuccess() {
      toast.success("Succeed!")
    },
    onError(err) {
      toast.error("Something went wrong!", {
        description: err.message || "There was a problem with your request.",
      })
    },
  })

  const handleResetAll = () => {
    mutate({
      forReal: "reset-batman",
    })
  }

  return (
    <div className="text-center">
      <Button
        disabled={isPending}
        variant="destructive"
        size="lg"
        onClick={handleResetAll}
        className="whitespace-nowrap px-12 font-bold"
      >
        Reset All
      </Button>
    </div>
  )
}
