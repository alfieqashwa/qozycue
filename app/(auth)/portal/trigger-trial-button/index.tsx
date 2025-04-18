"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { useState } from "react"
import { CreateTrialCompanyForm } from "../create-trial-company-form"

export function TriggerTrialButton({ userRole }: { userRole: boolean }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const buttonTitle = "trial"
  const title = "Trial Subscription"
  const description =
    "You have max of 10 pool tables, 20 products, 6 packets, and 5 users."

  const TriggerTrialDialog = dynamic(
    () => import("./trigger-trial-dialog.tsx"),
    { ssr: false },
  )
  const TriggerTrialDrawer = dynamic(
    () => import("./trigger-trial-drawer.tsx"),
    { ssr: false },
  )

  if (isDesktop) {
    return (
      <TriggerTrialDialog
        open={open}
        setOpen={setOpen}
        title={title}
        description={description}
        triggerButton={
          <Button
            disabled={!userRole}
            variant="secondary"
            size="sm"
            className="mx-2 animate-bounce font-semibold tracking-widest uppercase"
          >
            {buttonTitle}
          </Button>
        }
      >
        <CreateTrialCompanyForm setOpen={setOpen} />
      </TriggerTrialDialog>
    )
  }

  return (
    <TriggerTrialDrawer
      open={open}
      setOpen={setOpen}
      title={title}
      description={description}
      triggerButton={
        <Button
          disabled={!userRole}
          variant="secondary"
          size="sm"
          className="mx-2 animate-bounce font-semibold tracking-widest uppercase"
        >
          {buttonTitle}
        </Button>
      }
    >
      <CreateTrialCompanyForm setOpen={setOpen} />
    </TriggerTrialDrawer>
  )
}
