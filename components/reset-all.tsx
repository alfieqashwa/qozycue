"use client"

import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { ConvexError } from "convex/values"

export function ResetAll() {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.resetAll),
    onSuccess() {
      toast.success("Succeed!")
    },
    onError(err) {
      const errrorMesage =
        err instanceof ConvexError ? err.data : "Unexpected error occurred"
      toast.error("Something went wrong.", {
        description: errrorMesage,
      })
    },
  })

  const handleResetAll = () => {
    mutate({ forReal: process.env.NEXT_PUBLIC_RESET_ALL! })
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
