"use client"

import { buttonVariants } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useToggleStore } from "@/store/toggle-store"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { Building2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MdArrowRight } from "react-icons/md"

type CompanyInfoProps = {
  pathname: string
  company: FunctionReturnType<typeof api.companies.find>
}

export function CompanyInfo({ pathname, company }: CompanyInfoProps) {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    void useToggleStore.persist.rehydrate()
    setHasHydrated(true)
  }, [])

  const { data, status } = useTanstackQuery(
    convexQuery(api.pooltables.findAllByCompanyId, {
      companyId: company?._id as Id<"companies">,
    }),
  )
  if (!hasHydrated) return null

  if (status !== "success") return
  const displayPathname = configureDisplayPathname(pathname, data)

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

  function configureDisplayPathname(
    pathname: string,
    poolTableList: FunctionReturnType<typeof api.pooltables.findAllByCompanyId>,
  ) {
    // Remove "/" from pathname & substring from the last index of "/"
    const lastIndex = pathname.lastIndexOf("/")
    const displayPathname = pathname.substring(lastIndex + 1)
    //
    const hasPoolTableId = poolTableList?.some((t) => t._id === displayPathname)
    const poolTableName = `Table ${poolTableList?.find((t) => t._id === displayPathname)?.name}`

    return hasPoolTableId ? poolTableName : displayPathname
  }
}
