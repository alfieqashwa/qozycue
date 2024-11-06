"use client"

import { api } from "@/convex/_generated/api"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"
import { Button } from "./ui/button"

export function ResetAll() {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.resetAll),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "All sessions have been resetted.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  return (
    <div className="text-center">
      <Button
        disabled={isPending}
        variant="destructive"
        size="lg"
        onClick={() => mutate({ forReal: process.env.NEXT_PUBLIC_RESET_ALL! })}
        className="whitespace-nowrap px-12 font-bold"
      >
        Reset All
      </Button>
    </div>
  )
}
