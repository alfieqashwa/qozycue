"use client"

import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { Building2, Phone } from "lucide-react"
import Link from "next/link"
import { PoolTableList } from "./pool-table-list"

export function CompanySite({
  slug,
  preloadedSession,
}: {
  slug: string
  preloadedSession: Preloaded<typeof api.sessions.find>
}) {
  const session = usePreloadedQuery(preloadedSession)

  const { data: company, status } = useTanstackQuery({
    ...convexQuery(api.companies.findPublicProcedure, { slug }),
    enabled: Boolean(slug),
  })

  return (
    <>
      {status === "success" && (
        <section>
          <div className="sticky top-0 z-[50] flex h-20 items-center justify-between border-b-[3px] bg-background">
            <div className="flex items-center justify-end space-x-2 pr-4">
              {/* Starts Company Name */}
              <div className="group flex items-center gap-4 py-2">
                <section className="grid gap-1 px-2">
                  <div
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "default" }),
                    )}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={session ? `/${slug}/tables` : "/"}>
                          <Building2
                            size={32}
                            className={cn(
                              "mr-4 text-foreground hover:cursor-pointer",
                            )}
                          />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className="bg-muted text-muted-foreground">
                        {session ? "Go to Page Tables" : " Go to Home Page"}
                      </TooltipContent>
                    </Tooltip>

                    <p className="flex items-center font-semibold capitalize text-muted-foreground">
                      <span className="text-lg">{company?.name}</span>
                    </p>
                  </div>
                </section>
              </div>
              {/* Ends Company Name */}
            </div>

            <div className="mr-4 hidden items-center space-x-2 md:flex">
              <p className="font-medium capitalize text-muted-foreground">
                {company?.location}
              </p>
            </div>
            <div className="mr-4 hidden items-center space-x-2 text-muted-foreground md:flex">
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
    </>
  )
}
