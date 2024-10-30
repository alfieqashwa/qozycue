"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Hash, Key, Mail, User2, Users2 } from "lucide-react"
import Image from "next/image"

export function UserList({
  companyId,
  companyName,
}: {
  companyId: Id<"companies">
  companyName: string
}) {
  const { data: users, status } = useTanstackQuery(
    convexQuery(api.users.findAllByCompanyId, { companyId }),
  )

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <UserListDialog companyName={companyName} disabled={!users?.length}>
        <div>
          {status === "success" && (
            <Table>
              <TableCaption>A list of users.</TableCaption>
              <TableHeader>
                <TableRow className="capitalize">
                  {["image", "ID", "name", "email", "role"].map((title, i) => (
                    <TableHead className={cn(i === 0 && "sr-only")} key={i}>
                      {title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <UserTableRow user={user} key={user._id} />
                ))}
              </TableBody>
            </Table>
          )}
          {/* <ScrollBar orientation="horizontal" /> */}
        </div>
      </UserListDialog>
    )
  }

  return (
    <UserListDrawer companyName={companyName} disabled={!users?.length}>
      <ScrollArea>
        {status === "success" && (
          <Table>
            <TableCaption>A list of users.</TableCaption>
            <TableHeader>
              <TableRow className="capitalize">
                {["image", "ID", "name", "email", "role"].map((title, i) => (
                  <TableHead className={cn(i === 0 && "sr-only")} key={i}>
                    {title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserTableRow user={user} key={user._id} />
              ))}
            </TableBody>
          </Table>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </UserListDrawer>
  )
}

const UserTableRow = ({ user }: { user: Doc<"users"> }) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center">
        <span className="relative h-10 w-10">
          {!!user.image ? (
            <Image
              src={user.image}
              alt="username"
              fill
              className="rounded-full bg-background object-cover text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
            />
          ) : (
            <User2
              size={40}
              className="rounded-full bg-background object-cover p-1 text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
            />
          )}
        </span>
      </div>
    </TableCell>
    <TableCell className="w-[100px] font-medium">
      <Badge variant="secondary" className="px-3 py-1.5">
        <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="max-w-[300px] truncate">
          {user._id.slice(-8, user._id.length)}
        </span>
      </Badge>
    </TableCell>
    <TableCell className="whitespace-nowrap font-medium capitalize">
      <Badge
        variant="secondary"
        className={cn("px-3 py-1.5 text-muted-foreground")}
      >
        <User2 className="mr-2 h-4 w-4" />
        <span className="whitespace-nowrap capitalize">
          {user.name ?? "pending"}
        </span>
      </Badge>
    </TableCell>
    <TableCell>
      <div className="flex items-center">
        <Mail className="mr-2 h-4 w-4 text-primary" />
        <span>{user.email}</span>
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center">
        <Key className="mr-2 h-4 w-4 text-primary" />
        <span>{user.role}</span>
      </div>
    </TableCell>
  </TableRow>
)

type Props = {
  companyName: string
  disabled: boolean
  children: React.ReactNode
}

const UserListDialog = ({ companyName, disabled, children }: Props) => (
  <Dialog>
    <DialogTrigger
      disabled={disabled}
      className={cn(
        buttonVariants({ size: "sm" }),
        "disabled:pointer-events-auto disabled:cursor-not-allowed",
      )}
    >
      <Users2 size={16} />
    </DialogTrigger>

    <DialogContent className="min-w-fit">
      <DialogTitle className="capitalize">{companyName}</DialogTitle>
      {children}
    </DialogContent>
  </Dialog>
)

const UserListDrawer = ({ companyName, disabled, children }: Props) => (
  <Drawer>
    <DrawerTrigger
      disabled={disabled}
      className={cn(
        buttonVariants({ size: "sm" }),
        "disabled:pointer-events-auto disabled:cursor-not-allowed",
      )}
    >
      <Users2 size={16} />
    </DrawerTrigger>

    <DrawerContent className="px-2">
      <DrawerTitle className="mb-2 mt-4 text-center capitalize">
        {companyName}
      </DrawerTitle>
      {children}
    </DrawerContent>
  </Drawer>
)
