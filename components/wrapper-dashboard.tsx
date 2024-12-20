"use client"

import { type TLinkList } from "@/app/constants/link-list"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { useToggleStore } from "@/store/toggle-store"
import { Preloaded, usePreloadedQuery } from "convex/react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { GiFrozenOrb } from "react-icons/gi"
import { CompanyInfo } from "./company-info"
import { ConnectionStatus } from "./connection-status"
import { MenuOnMobile } from "./menu-on-mobile"
import { Nav } from "./nav"
import { ToggleGrip } from "./toggle-grip"
import { UserAvatar } from "./user-avatar"

//? https://nextjs.org/docs/messages/react-hydration-error
const ToggleThemes = dynamic(() => import("./toggle-themes"), {
  ssr: false,
})

type WrapperDashboardProps = {
  linkList: TLinkList[]
  preloadedSession: Preloaded<typeof api.sessions.find>
  className?: string
  children: React.ReactNode
}

export function WrapperDashboard({
  linkList,
  preloadedSession,
  className,
  children,
}: WrapperDashboardProps) {
  const { user } = usePreloadedQuery(preloadedSession)
  const store = useToggleStore()
  const pathname = usePathname()

  /*
   * source: https://github.com/pmndrs/zustand/issues/938#issuecomment-1812606279
   */
  const [hasHydrated, setHasHydrated] = useState(false)
  useEffect(() => {
    void useToggleStore.persist.rehydrate()
    setHasHydrated(true)
  }, [])

  if (!hasHydrated) return null

  const ownerAccessLevel = ["DEWA", "ADMIN", "OWNER"].includes(user.role ?? "")
  const managerAccessLevel = ["DEWA", "ADMIN", "OWNER", "MANAGER"].includes(
    user.role ?? "",
  )

  return (
    <div className="relative pb-12 sm:pb-4">
      <div className="sticky top-0 z-[50] flex h-20 items-center justify-between border-b-[3px] bg-background">
        <CompanyInfo company={user.company} pathname={pathname} />
        <div className="flex items-center justify-end space-x-0.5 pr-4 md:space-x-2">
          <ConnectionStatus />
          <ToggleThemes />
          <UserAvatar user={user} slug={user.company?.slug} />
        </div>
      </div>

      {/* //? STARTS SIDEBAR */}
      <div
        className={cn(
          "fixed z-20 hidden min-h-[calc(100vh_-_5rem)] min-w-[50px] border-r-4 bg-background py-2 transition-all duration-150 ease-in-out sm:block",
          store.toggle ? "w-0 sm:w-20" : "w-0 sm:w-56",
        )}
      >
        <ToggleGrip />
        <ScrollArea className="h-svh">
          <Nav
            ownerAccessLevel={ownerAccessLevel}
            managerAccessLevel={managerAccessLevel}
            slug={user.company?.slug as string}
            links={linkList.filter((l) => l.isGeneral)}
          />
          <Separator className="py-[1px]" />
          <Nav
            ownerAccessLevel={ownerAccessLevel}
            managerAccessLevel={managerAccessLevel}
            slug={user.company?.slug as string}
            links={linkList.filter((l) => !l.isGeneral)}
          />
          {/* //? set padding-bottom so the sidebar can be fully-scrolled on mobile-view's landscape */}
          <nav className={cn("pb-24", store.toggle ? "pl-3.5" : "pl-2")}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={
                    pathname.includes("dewa")
                      ? `/${encodeURIComponent(user.company?.slug as string)}/dashboard`
                      : `/dewa`
                  }
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "relative size-12",
                    user.role === "DEWA" ? "block" : "hidden",
                  )}
                >
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <GiFrozenOrb className={cn(className)} />
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="flex items-center gap-4 bg-muted"
              >
                <span className="text-sm capitalize tracking-wider text-primary">
                  {pathname.includes("dewa") ? user.company?.name : "dewa"}
                </span>
              </TooltipContent>
            </Tooltip>
          </nav>
        </ScrollArea>
      </div>
      {/* //? ENDS SIDEBAR */}

      <main
        className={cn(
          "min-h-[calc(100vh_-_5rem)] bg-background p-1 transition-all duration-150 ease-in-out sm:p-4",
          store.toggle ? "ml-0 sm:ml-20" : "ml-0 sm:ml-56",
        )}
      >
        {children}
      </main>
      <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 sm:hidden">
        <MenuOnMobile
          isOwner={ownerAccessLevel}
          slug={user.company?.slug as string}
          links={linkList}
          dewaRole={user.role === "DEWA"}
          className={className}
        />
      </footer>
    </div>
  )
}
