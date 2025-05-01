"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Id } from "@/convex/_generated/dataModel"
import { Subscription } from "@/types"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Copy } from "lucide-react"
import { useState } from "react"
import { DeleteCompany } from "./delete-company"
import { UpdateCompany } from "./update-company"
import { UpdateCompanyForm } from "./update-company-form"

type CompanyRowActionProps = {
  id: Id<"companies">
  name: string
  phone: string
  location: string
  countryCode: string
  subscription: Subscription
}

export function CompanyRowActions({
  id,
  name,
  phone,
  location,
  countryCode,
  subscription,
}: CompanyRowActionProps) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(id)}
          className="group hover:cursor-pointer"
        >
          <Copy className="text-muted-foreground/70 group-hover:text-primary mr-2 h-3.5 w-3.5" />
          <span className="group-hover:text-primary">Copy ID</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <UpdateCompany name={name}>
          <UpdateCompanyForm
            id={id}
            name={name}
            phone={phone}
            location={location}
            subscription={subscription}
            countryCode={countryCode}
            setOpen={setOpen}
          />
        </UpdateCompany>
        <DropdownMenuItem
          className="group"
          onSelect={(e) => e.preventDefault()}
        >
          <DeleteCompany id={id} name={name} setOpen={setOpen} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
