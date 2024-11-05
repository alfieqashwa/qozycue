"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Building2, LayoutTemplate, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import { TogglePublished } from "./toggle-published"
import { UpdateCompanyInfo } from "./update-company-info"
import { UpdateUserRoleForMeOnly } from "./update-user-role-for-me-only"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Id } from "@/convex/_generated/dataModel"

export function UserInfo({
  isAdmin,
  userId,
  companyId,
}: {
  isAdmin: boolean
  userId: Id<"users"> | undefined
  companyId: Id<"companies"> | undefined
}) {
  const { data: userWithCompany, status: StatusUserWithCompany } =
    useTanstackQuery({
      enabled: Boolean(userId) && Boolean(companyId),
      ...convexQuery(api.users.findUserWithCompany, { userId, companyId }),
    })

  const orders = useTanstackQuery({
    enabled: Boolean(companyId),
    ...convexQuery(api.orders.findAll, { companyId: companyId! }),
  })

  return (
    <div className="flex flex-col">
      {StatusUserWithCompany === "pending" && <LoadingSpinner />}
      {StatusUserWithCompany === "success" && (
        <div className="px-4">
          <Image
            src={userWithCompany.user?.image as string}
            alt="Profile Image"
            width={500}
            height={500}
            className="size-32 rounded-full object-cover p-1 ring-2 ring-primary"
          />
          <section className="mt-6 space-y-2">
            <article>
              <h2 className="text-primary">Email</h2>
              <p className="text-muted-foreground">
                {userWithCompany.user?.image}
              </p>
            </article>
            <article>
              <h2 className="text-primary">Name</h2>
              <p className="capitalize text-muted-foreground">
                {userWithCompany.user?.name}
              </p>
            </article>
            <article>
              <h2 className="text-primary">Role</h2>
              {/* // Only me can access this! */}
              {userWithCompany.user?.email ===
              process.env.NEXT_PUBLIC_DEWA_EMAIL ? (
                <UpdateUserRoleForMeOnly
                  id={userWithCompany.user?._id!}
                  role={userWithCompany.user?.role}
                />
              ) : (
                <p className="text-muted-foreground">
                  {userWithCompany.user?.role}
                </p>
              )}
            </article>
            <Separator />
          </section>
          <section className="space-y-4 pt-4">
            <div className="flex space-x-1">
              <Building2 className="mr-2 shrink-0 text-primary" />
              <p className="space-x-1 capitalize text-muted-foreground">
                <span>{userWithCompany.company?.name}</span>
              </p>
            </div>
            <div className="flex space-x-1">
              <Phone className="mr-2 shrink-0 text-primary" />
              <p className="text-muted-foreground">
                {userWithCompany.company?.phone}
              </p>
            </div>
            <div className="flex space-x-1">
              <MapPin className="mr-2 shrink-0 text-primary" />
              <p className="space-x-1 text-balance capitalize text-muted-foreground">
                {userWithCompany.company?.location}
              </p>
            </div>
            {isAdmin && !!userWithCompany.company && (
              <section>
                <div className="flex space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LayoutTemplate className="mr-2 shrink-0 animate-pulse text-primary" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-muted font-medium text-muted-foreground"
                    >
                      When enabled, it will activate the booking feature
                    </TooltipContent>
                  </Tooltip>
                  <p className="text-balance pr-2 capitalize text-muted-foreground">
                    Published?
                  </p>
                  {orders.status === "success" && (
                    <TogglePublished
                      companyId={userWithCompany.company._id}
                      companyName={userWithCompany.company.name}
                      isPublished={userWithCompany.company.isPublished}
                      countAllBooking={orders.data}
                    />
                  )}
                </div>
                <UpdateCompanyInfo
                  isAdmin={isAdmin}
                  companyId={userWithCompany.company._id}
                  phone={userWithCompany.company.phone}
                  location={userWithCompany.company.location}
                  className="mt-4"
                />
              </section>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
