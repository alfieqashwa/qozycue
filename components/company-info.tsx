"use client"

import { Building2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MdArrowRight } from "react-icons/md"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToggleStore } from "@/store/toggle-store"
import { FunctionReturnType } from "convex/server"
import { api } from "@/convex/_generated/api"

type CompanyInfoProps = {
  company: FunctionReturnType<typeof api.companies.find>
  displayPathname: string
}

export function CompanyInfo({ company, displayPathname }: CompanyInfoProps) {
  const [hasHydrated, setHasHydrated] = useState(false)
  useEffect(() => {
    void useToggleStore.persist.rehydrate()
    setHasHydrated(true)
  }, [])

  if (!hasHydrated) return null

  return (
    <div className="group flex items-center gap-4 py-2">
      <section className="grid gap-1 px-2">
        <div
          className={cn(buttonVariants({ variant: "ghost", size: "default" }))}
        >
          <Link href={`/${company?.slug}`}>
            <Building2
              size={32}
              className={cn("mr-4 text-primary hover:cursor-pointer")}
            />
          </Link>

          <p className="flex items-center font-semibold capitalize text-muted-foreground">
            <span className="md:text-lg">{company?.name}</span>
            <MdArrowRight className="mx-2 hidden lg:block" />
            <span className="hidden lg:block">{displayPathname}</span>
          </p>
        </div>
      </section>
    </div>
  )
}
