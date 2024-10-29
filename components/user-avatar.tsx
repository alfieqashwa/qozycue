import { DASHBOARD_LINK_LIST } from "@/app/constants/link-list"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { FunctionReturnType } from "convex/server"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutDialog } from "./sign-out-dialog"
import { UserInfo } from "./user-info"

type UserAvatarProps = {
  user: FunctionReturnType<typeof api.users.me>
  slug: string
}

export function UserAvatar({ user, slug }: UserAvatarProps) {
  const pathname = usePathname()

  return (
    <Menubar className="h-12 w-12 items-center justify-center rounded-full border-2 border-primary/80 p-0 transition-colors duration-300 ease-in-out hover:border-primary">
      <MenubarMenu>
        <MenubarTrigger className="relative h-10 w-10 rounded-full px-0 py-0 hover:cursor-pointer">
          <Image
            src={user?.image as string}
            alt="User Avatar"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" //? https://nextjs.org/docs/pages/api-reference/components/image#sizes
            className="rounded-full"
          />
        </MenubarTrigger>
        {/* // Mobile View */}
        <MenubarContent className="mr-2 mt-3.5 w-52">
          <UserInfo
            userAccount={user?.name ?? user?.email}
            userRole={user?.role}
            pathname={pathname}
            href={`/${encodeURIComponent(slug)}/profile`}
          />
          {DASHBOARD_LINK_LIST.filter((l) => l.title === "settings").map(
            (link) => (
              <Link href={`/${slug}${link.href}`} key={link.title}>
                <MenubarItem
                  className={cn(
                    "capitalize text-muted-foreground hover:cursor-pointer",
                    pathname === `/${slug}${link.href}` && "bg-muted",
                  )}
                >
                  {link.title}
                  <MenubarShortcut
                    className={cn(
                      pathname === `/${slug}${link.href}`
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <link.icon size={18} className="shrink-0" />
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
              </Link>
            ),
          )}
          <SignOutDialog />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
