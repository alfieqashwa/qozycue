"use client"

import { type TLinkList } from "@/app/constants/link-list"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useToggleStore } from "@/store/toggle-store"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type NavProps = {
  ownerAccessLevel: boolean
  managerAccessLevel: boolean
  slug: string
  links: TLinkList[]
}

export function Nav({
  ownerAccessLevel,
  managerAccessLevel,
  slug,
  links,
}: NavProps) {
  const store = useToggleStore()
  const pathname = usePathname()

  const [hasHydrated, setHasHydrated] = useState(false)
  useEffect(() => {
    void useToggleStore.persist.rehydrate()
    setHasHydrated(true)
  }, [])

  if (!hasHydrated) return null

  return (
    <div
      data-collapsed={store.toggle}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-1 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2">
        {links.map((link, index) =>
          store.toggle ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={
                    !pathname.includes("dewa")
                      ? `/${encodeURIComponent(slug)}${link.href}`
                      : link.href
                  }
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "text-primary/70 hover:text-primary size-12",
                    !pathname.includes("dewa")
                      ? pathname ===
                          `/${encodeURIComponent(slug)}${link.href}` &&
                          "bg-muted text-primary hover:bg-muted"
                      : pathname === link.href &&
                          "bg-muted text-primary hover:bg-muted",
                    link.href === "/dashboard" && !ownerAccessLevel && "hidden",
                    link.href === "/products" &&
                      !managerAccessLevel &&
                      "hidden",
                    link.href === "/settings" &&
                      !managerAccessLevel &&
                      "hidden",
                  )}
                >
                  <link.icon className="size-7 shrink-0" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-muted flex items-center gap-4"
              >
                <span className="text-primary text-sm tracking-wider capitalize">
                  {link.title}
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={
                !pathname.includes("dewa")
                  ? `/${encodeURIComponent(slug)}${link.href}`
                  : link.href
              }
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "text-primary/70 hover:text-primary h-12 justify-start",
                !pathname.includes("dewa")
                  ? pathname === `/${encodeURIComponent(slug)}${link.href}` &&
                      "bg-muted text-primary hover:bg-muted"
                  : pathname === link.href &&
                      "bg-muted text-primary hover:bg-muted",
                link.href === "/dashboard" && !ownerAccessLevel && "hidden",
                link.href === "/products" && !managerAccessLevel && "hidden",
                link.href === "/settings" && !managerAccessLevel && "hidden",
              )}
            >
              <link.icon className="mr-4 ml-2 size-7 shrink-0" />
              <span className="text-muted-foreground text-base font-semibold capitalize">
                {link.title}
              </span>
            </Link>
          ),
        )}
      </nav>
    </div>
  )
}
