"use client"

import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { Building2, Layers, LayoutTemplate, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import { TogglePublished } from "./toggle-published"
import { UpdateCompanyInfo } from "./update-company-info"
import { UpdateUserRoleForMeOnly } from "./update-user-role-for-me-only"

export function UserProfile({
  preloadedSession,
}: {
  preloadedSession: Preloaded<typeof api.sessions.find>
}) {
  const { user } = usePreloadedQuery(preloadedSession)
  const adminAccessLevel = ["DEWA", "ADMIN"].includes(user.role ?? "")

  const bookingOrders = useTanstackQuery({
    ...convexQuery(api.orders.findAllBookingByCompanyId, {
      companyId: user.companyId!,
    }),
    enabled: Boolean(user.companyId),
    select(data) {
      return data.filter((order) => order.poolRental)
    },
  })

  return (
    <div className="flex flex-col">
      <div className="px-4">
        {user.image ? (
          <Image
            src={user.image}
            alt="Profile Image"
            width={500}
            height={500}
            priority
            className="size-32 rounded-full object-cover p-1 ring-4 ring-primary"
          />
        ) : (
          <div className="grid size-32 place-items-center rounded-full ring-4 ring-primary">
            <h1 className="text-9xl font-bold capitalize text-primary">
              {user.name ? user.name.at(0) : user.email!.at(0)}
            </h1>
          </div>
        )}
        <section className="mt-6 space-y-2">
          <article>
            <h2 className="text-primary">Email</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </article>
          {user.name && (
            <article>
              <h2 className="text-primary">Name</h2>
              <p className="capitalize text-muted-foreground">{user.name}</p>
            </article>
          )}
          {/* // Only me can access this! */}
          {user.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN ? (
            <article>
              <h2 className="text-primary">Role</h2>
              <p className="text-muted-foreground">{user.role}</p>
            </article>
          ) : (
            <article>
              <UpdateUserRoleForMeOnly
                id={user._id as Id<"users">}
                role={user.role}
              />
            </article>
          )}
          <Separator />
        </section>
        <section className="mt-8 space-y-4">
          <div className="flex space-x-1">
            <Building2 className="mr-2 shrink-0 text-primary" />
            <p className="space-x-1 capitalize text-muted-foreground">
              <span>{user.company?.name}</span>
            </p>
          </div>
          <div className="flex space-x-1">
            <Phone className="mr-2 shrink-0 text-primary" />
            <p className="text-muted-foreground">{user.company?.phone}</p>
          </div>
          <div className="flex space-x-1">
            <MapPin className="mr-2 shrink-0 text-primary" />
            <p className="space-x-1 text-balance capitalize text-muted-foreground">
              {user.company?.location}
            </p>
          </div>
          <div className="flex space-x-1">
            <Layers className="mr-2 shrink-0 text-primary" />
            <p className="space-x-1 text-balance capitalize text-muted-foreground">
              {user.company?.subscription} Subscription
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
                {bookingOrders.status === "success" && (
                  <TogglePublished
                    companyId={user.companyId as Id<"companies">}
                    companyName={user.company?.name as string}
                    isPublished={user.company?.isPublished as boolean}
                    countAllBooking={!!bookingOrders.data.length}
                  />
                )}
              </div>
              <UpdateCompanyInfo
                adminAccessLevel={adminAccessLevel}
                companyId={user.companyId as Id<"companies">}
                phone={user.company?.phone as string}
                location={user.company?.location as string}
                className="mt-4"
              />
            </section>
          )}
        </section>
      </div>
    </div>
  )
}
