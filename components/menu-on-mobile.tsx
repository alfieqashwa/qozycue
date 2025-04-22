import { type TLinkList } from "@/app/constants/link-list"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { GiFrozenOrb } from "react-icons/gi"

export function MenuOnMobile({
  isOwner,
  isManager,
  slug,
  links,
  dewaRole,
  className,
}: {
  isOwner: boolean
  isManager: boolean
  slug: string
  links: TLinkList[]
  dewaRole: boolean
  className?: string
}) {
  const pathname = usePathname()
  const [openDrawer, setOpenDrawer] = useState(false)

  return (
    <Drawer
      open={openDrawer}
      onOpenChange={setOpenDrawer}
      autoFocus={openDrawer}
    >
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="text-primary size-10 shrink-0 font-semibold tracking-wider opacity-70 transition-opacity duration-300 ease-in-out hover:opacity-100"
        >
          <Menu className="animate-pulse" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:hidden">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Click to where ever you want.</DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto grid grid-cols-4 gap-6">
          {links.map((link, index) => (
            <Popover key={`${index}-${link}`}>
              <PopoverTrigger asChild>
                <Link
                  href={
                    !pathname.includes("dewa")
                      ? `/${encodeURIComponent(slug)}${link.href}`
                      : link.href
                  }
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "text-primary/70 hover:text-primary size-16",
                    !pathname.includes("dewa")
                      ? pathname ===
                          `/${encodeURIComponent(slug)}${link.href}` &&
                          "bg-muted text-primary hover:bg-muted"
                      : pathname === link.href &&
                          "bg-muted text-primary hover:bg-muted",
                    link.href === "/dashboard" && !isOwner && "hidden",
                    link.href === "/products" && !isManager && "hidden",
                    link.href === "/settings" && !isManager && "hidden",
                  )}
                >
                  <link.icon size={32} className="size-8 shrink-0" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                className="bg-muted text-muted-foreground w-auto px-4 py-2 text-xs capitalize"
              >
                {link.title}
              </PopoverContent>
            </Popover>
          ))}

          <Link
            href={
              pathname.includes("dewa")
                ? `/${encodeURIComponent(slug)}/dashboard`
                : `/dewa`
            }
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative size-16",
              dewaRole ? "block" : "hidden",
            )}
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <GiFrozenOrb className={cn(className)} />
            </span>
          </Link>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
