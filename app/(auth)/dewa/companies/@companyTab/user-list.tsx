"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
import { FunctionReturnType } from "convex/server"
import { Hash, Key, Mail, User2, Users2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function UserList({
  companyId,
  companyName,
}: {
  companyId: Id<"companies">
  companyName: string
}) {
  const [open, setOpen] = useState(false)
  const { data: users, status } = useTanstackQuery(
    convexQuery(api.users.findAllByCompanyId, { companyId }),
  )

  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={!users?.length}
        className={cn(
          buttonVariants({ size: "sm" }),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Users2 size={16} />
      </SheetTrigger>

      <SheetContent side="top" className="px-2 md:px-8">
        <SheetTitle className="mb-2 mt-4 text-center capitalize">
          {companyName}
        </SheetTitle>
        <SheetDescription className="text-center font-medium">
          Total {users?.length} {users?.length === 1 ? "user" : "users"}
        </SheetDescription>
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
      </SheetContent>
    </Sheet>
  )
}

const UserTableRow = ({
  user,
}: {
  user: FunctionReturnType<typeof api.users.findAllByCompanyId>[0]
}) => (
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
