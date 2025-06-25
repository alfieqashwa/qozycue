"use client"

import { buttonVariants } from "@/components/ui/button"
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PoolTableList } from "./pool-table-list"

export function CompanySite({
  slug,
  preloadedUser,
}: {
  slug: string
  preloadedUser: Preloaded<typeof api.users.me>
}) {
  const user = usePreloadedQuery(preloadedUser)

  const { data: company, status } = useTanstackQuery({
    ...convexQuery(api.companies.findPublicProcedure, { slug }),
    enabled: Boolean(slug),
  })

  const country = countries.find((c) => c.code === company?.countryCode)
  return (
    <div className="min-h-screen w-full">
      {status === "success" && (
        <section>
          <div className="bg-background sticky top-0 z-50 flex h-20 items-center justify-between border-b-[3px]">
            <div className="flex items-center justify-end space-x-2 pr-4">
              {/* Starts Company Name */}
              <div className="group flex items-center gap-4 py-2">
                <section className="grid">
                  <div
                    className={cn(
                      "space-x-3",
                      buttonVariants({ variant: "ghost", size: "default" }),
                    )}
                  >
                    <WrapperTooltip
                      content={`${user ? "Go to Page Tables" : " Go to Home Page"}`}
                    >
                      <Link href={user ? `/${slug}/tables` : "/"}>
                        {country?.flag && (
                          <Image
                            src={country.flag}
                            width={500}
                            height={500}
                            alt="Flag"
                            className="animate-pulse-slow h-8 w-14 rounded shadow-md ring hover:cursor-pointer"
                          />
                        )}
                      </Link>
                    </WrapperTooltip>
                    <p className="text-muted-foreground flex items-center font-semibold capitalize">
                      <span className="text-lg">{company?.name}</span>
                    </p>
                  </div>
                </section>
              </div>
              {/* Ends Company Name */}
            </div>

            <div className="mr-4 hidden items-center space-x-2 md:flex">
              <p className="text-muted-foreground font-medium capitalize">
                {company?.location}
              </p>
            </div>
            <div className="text-muted-foreground mr-4 hidden items-center space-x-2 md:flex">
              <Phone size={20} />
              <p>{company?.phone}</p>
            </div>
          </div>
          {company?.isPublished && (
            <PoolTableList
              companyId={company._id}
              companyName={company.name}
              companyPhone={company.phone}
            />
          )}
        </section>
      )}
    </div>
  )
}
