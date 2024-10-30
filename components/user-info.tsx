import { MenubarItem, MenubarShortcut } from "@/components/ui/menubar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Role } from "@/types"
import { Key } from "lucide-react"
import Link from "next/link"

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
  <Tooltip>
    <TooltipTrigger asChild>
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
    </TooltipTrigger>
    <TooltipContent side="left" className="mr-1.5 flex items-center bg-muted">
      <Key
        size={16}
        className={cn(
          "mr-1.5",
          pathname === href ? "text-primary" : "text-muted-foreground",
        )}
      />
      <span className="text-xs text-muted-foreground">{userRole}</span>
    </TooltipContent>
  </Tooltip>
)
