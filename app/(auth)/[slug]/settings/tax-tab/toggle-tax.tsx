"use client"

import { useRouter } from "next/navigation"
import { Switch } from "~/components/ui/switch"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"

export function ToggleTax({
  id,
  isDefaultValue,
  hasDefaultValueTax,
}: {
  id: string
  isDefaultValue: boolean
  hasDefaultValueTax: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()
  const { mutate, isPending, variables } = api.tax.toggle.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: (
          <p>
            {variables?.isDefaultValue === true ? "Enabled" : "Disabled"}{" "}
            defaultValue
          </p>
        ),
      })
      router.refresh()
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  const disabledNonDefaultValueTax = hasDefaultValueTax && !isDefaultValue
  return (
    <Switch
      disabled={isPending || disabledNonDefaultValueTax}
      checked={isDefaultValue}
      onCheckedChange={() =>
        mutate({ id, isDefaultValue: isDefaultValue === true ? false : true })
      }
    />
  )
}
