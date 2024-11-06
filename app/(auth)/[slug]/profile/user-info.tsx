"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { Building2, Layers, LayoutTemplate, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import { TogglePublished } from "./toggle-published"
import { UpdateCompanyInfo } from "./update-company-info"
import { UpdateUserRoleForMeOnly } from "./update-user-role-for-me-only"

export function UserInfo({
  adminAccessLevel,
  userId,
  companyId,
}: {
  adminAccessLevel: boolean
  userId: Id<"users"> | undefined
  companyId: Id<"companies"> | undefined
}) {
  // source -> https://tanstack.com/query/v4/docs/framework/react/reference/useQueries
  const [{ data: userWithCompany, status }, orders] = useTanstackQueries({
    queries: [
      {
        ...convexQuery(api.users.findUserWithCompany, { userId, companyId }),
        enabled: Boolean(userId) && Boolean(companyId),
      },
      {
        ...convexQuery(api.orders.findAll, { companyId: companyId! }),
        enabled: Boolean(companyId),
      },
    ],
  })

  if (
    status !== "success" ||
    !userWithCompany?.user ||
    !userWithCompany?.company
  )
    return <LoadingSpinner />

  return (
    <div className="flex flex-col">
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
              {userWithCompany.user?.email}
            </p>
          </article>
          <article>
            <h2 className="text-primary">Name</h2>
            <p className="capitalize text-muted-foreground">
              {userWithCompany.user?.name}
            </p>
          </article>
          {/* // Only me can access this! */}
          {userWithCompany.user?.email !==
          process.env.NEXT_PUBLIC_SUPER_ADMIN ? (
            <article>
              <h2 className="text-primary">Role</h2>
              <p className="text-muted-foreground">
                {userWithCompany.user?.role}
              </p>
            </article>
          ) : (
            <article>
              <UpdateUserRoleForMeOnly
                id={userWithCompany.user?._id}
                role={userWithCompany.user?.role}
              />
            </article>
          )}
          <Separator />
        </section>
        <section className="mt-8 space-y-4">
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
          <div className="flex space-x-1">
            <Layers className="mr-2 shrink-0 text-primary" />
            <p className="space-x-1 text-balance capitalize text-muted-foreground">
              {userWithCompany.company?.subscription} Subscription
            </p>
          </div>
          {adminAccessLevel && (
            <section>
              <div className="flex space-x-1 pb-4">
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
                    countAllBooking={!!orders.data.length}
                  />
                )}
              </div>
              <UpdateCompanyInfo
                adminAccessLevel={adminAccessLevel}
                companyId={userWithCompany.company._id}
                phone={userWithCompany.company.phone}
                location={userWithCompany.company.location}
                className="mt-4"
              />
            </section>
          )}
        </section>
      </div>
    </div>
  )
}
