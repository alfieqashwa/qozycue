"use client"

import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { useToggleStore } from "@/store/toggle-store"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { MdArrowRight } from "react-icons/md"

type CompanyInfoProps = {
  pathname: string
  company: FunctionReturnType<typeof api.sessions.find>["user"]["company"]
}

export function CompanyInfo({ pathname, company }: CompanyInfoProps) {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    void useToggleStore.persist.rehydrate()
    setHasHydrated(true)
  }, [])

  const { data, status } = useTanstackQuery(
    convexQuery(api.poolTables.findAll, {}),
  )
  if (!hasHydrated) return null

  const displayPathname = configureDisplayPathname(pathname, data)

  const country = countries.find(
    (c) => c.code === (company?.countryCode as string),
  )
  return (
    <div className="flex items-center space-x-3 pl-4">
      <Link href={`/${company?.slug}`}>
        <Image
          src={country?.flag as string}
          width={500}
          height={500}
          alt={country?.country as string}
          className="animate-pulse-slow h-8 w-12 rounded shadow-md ring hover:cursor-pointer"
        />
        {/* <Building2 */}
        {/*   className={cn("text-primary mr-2 size-8 hover:cursor-pointer")} */}
        {/* /> */}
      </Link>

      <p className="text-muted-foreground flex items-center font-semibold capitalize">
        <span className="md:text-lg">{company?.name}</span>
        <MdArrowRight className="mx-2 hidden lg:block" />
        {status === "success" && (
          <span className="hidden lg:block">{displayPathname}</span>
        )}
      </p>
    </div>
  )

  function configureDisplayPathname(
    pathname: string,
    poolTableList:
      | FunctionReturnType<typeof api.poolTables.findAll>
      | undefined,
  ) {
    // Remove "/" from pathname & substring from the last index of "/"
    const lastIndex = pathname.lastIndexOf("/")
    const displayPathname = pathname.substring(lastIndex + 1)
    const hasPoolTableId = poolTableList?.some((t) => t._id === displayPathname)
    const poolTableName = `Table ${poolTableList?.find((t) => t._id === displayPathname)?.name}`

    return hasPoolTableId ? poolTableName : displayPathname
  }
}
