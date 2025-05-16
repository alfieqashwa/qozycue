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
  classNames?: string
  children: React.ReactNode
}

export function WrapperDashboard({
  linkList,
  preloadedSession,
  classNames,
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

  const ownerAccessLevel = ["ZENITH", "ADMIN", "OWNER"].includes(
    user.role ?? "",
  )
  const managerAccessLevel = ["ZENITH", "ADMIN", "OWNER", "MANAGER"].includes(
    user.role ?? "",
  )

  return (
    <div className="relative">
      <div className="bg-background sticky top-0 z-50 flex h-20 items-center justify-between border-b-[3px]">
        <CompanyInfo company={user.company} pathname={pathname} />
        <div className="flex items-center justify-end space-x-0.5 pr-4 md:space-x-2">
          <ConnectionStatus />
          <ToggleThemes />
          <UserAvatar
            managerAccessLevel={managerAccessLevel}
            user={user}
            slug={user.company?.slug}
          />
        </div>
      </div>

      {/* //? STARTS SIDEBAR */}
      <div
        className={cn(
          "bg-background fixed z-20 hidden min-h-[calc(100vh_-_5rem)] min-w-[50px] border-r-4 py-2 transition-all duration-150 ease-in-out sm:block",
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
          <nav className="pb-24 pl-3.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={
                    pathname.includes("zenith")
                      ? `/${encodeURIComponent(user.company?.slug as string)}/dashboard`
                      : `/zenith`
                  }
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "relative size-12",
                    user.role === "ZENITH" ? "block" : "hidden",
                  )}
                >
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <GiFrozenOrb className={cn(classNames)} />
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-muted flex items-center gap-4"
              >
                <span className="text-primary text-sm tracking-wider capitalize">
                  {pathname.includes("zenith") ? user.company?.name : "zenith"}
                </span>
              </TooltipContent>
            </Tooltip>
          </nav>
        </ScrollArea>
      </div>
      {/* //? ENDS SIDEBAR */}

      <main
        className={cn(
          "bg-background min-h-[calc(100vh_-_5rem)] p-1 transition-all duration-150 ease-in-out sm:p-4",
          store.toggle ? "ml-0 sm:ml-20" : "ml-0 sm:ml-56",
        )}
      >
        {children}
      </main>
      <footer className="fixed bottom-2 left-1/2 z-50 -translate-x-1/2 sm:hidden">
        <MenuOnMobile
          isOwner={ownerAccessLevel}
          isManager={managerAccessLevel}
          slug={user.company?.slug as string}
          links={linkList}
          zenithRole={user.role === "ZENITH"}
          className={classNames}
        />
      </footer>
    </div>
  )
}
