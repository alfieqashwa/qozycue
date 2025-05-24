import { MenubarItem, MenubarShortcut } from "@/components/ui/menubar"
import { cn } from "@/lib/utils"
import { Role } from "@/types"
import { Key } from "lucide-react"
import Link from "next/link"
import { WrapperTooltip } from "./wrapper-tooltip"

export const UserInfo = ({
  userAccount,
  userRole,
  pathname,
  href,
}: {
  userAccount?: string | null
  userRole?: Role
  pathname: string
  href: string
}) => (
  <WrapperTooltip
    side="left"
    icon={
      <Key
        size={16}
        className={cn(
          "mr-1.5",
          pathname === href ? "text-primary" : "text-muted-foreground",
        )}
      />
    }
    content={userRole!}
  >
    <Link href={href}>
      <MenubarItem
        className={cn(
          "text-muted-foreground hover:cursor-pointer",
          pathname === href && "bg-muted",
        )}
      >
        Profile
        <MenubarShortcut
          className={cn(
            "capitalize",
            pathname === href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {userAccount}
        </MenubarShortcut>
      </MenubarItem>
    </Link>
  </WrapperTooltip>
)
