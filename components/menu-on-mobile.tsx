import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { GiFrozenOrb } from "react-icons/gi"
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

export function MenuOnMobile({
  isOwner,
  slug,
  links,
  dewaRole,
  className,
}: {
  isOwner: boolean
  slug: string
  links: TLinkList[]
  dewaRole: boolean
  className?: string
}) {
  const pathname = usePathname()

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="font-semibold tracking-wider text-primary opacity-60 transition-opacity duration-300 ease-in-out hover:opacity-100"
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
            <Popover key={index}>
              <PopoverTrigger asChild>
                <Link
                  href={
                    !pathname.includes("dewa")
                      ? `/${encodeURIComponent(slug)}${link.href}`
                      : link.href
                  }
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-16 text-primary/70 hover:text-primary",
                    !pathname.includes("dewa")
                      ? pathname ===
                          `/${encodeURIComponent(slug)}${link.href}` &&
                          "bg-muted text-primary hover:bg-muted"
                      : pathname === link.href &&
                          "bg-muted text-primary hover:bg-muted",
                    link.href === "/dashboard" && !isOwner && "hidden",
                  )}
                >
                  <link.icon size={32} className="shrink-0" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                className="w-auto bg-muted px-4 py-2 text-xs capitalize text-muted-foreground"
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
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <GiFrozenOrb className={cn(className)} />
            </span>
          </Link>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
