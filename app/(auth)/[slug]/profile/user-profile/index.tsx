"use client"

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
import {
  Building2,
  Layers,
  LayoutTemplate,
  MapPin,
  Phone,
  Utensils,
} from "lucide-react"
import { ProfileAvatar } from "./profile-avatar"
import { TogglePublished } from "./toggle-published"
import { ToggleStockable } from "./toggle-stockable"
import { UpdateCompanyInfo } from "./update-company-info"
import { UpdateUserRoleForMeOnly } from "./update-user-role-for-me-only"
import { countries } from "@/lib/countries"
import Image from "next/image"
import { WrapperTooltip } from "@/components/wrapper-tooltip"

export function UserProfile({
  preloadedSession,
}: {
  preloadedSession: Preloaded<typeof api.sessions.find>
}) {
  const { user } = usePreloadedQuery(preloadedSession)
  const adminAccessLevel = ["ZENITH", "ADMIN"].includes(user.role ?? "")

  const bookingOrders = useTanstackQuery({
    ...convexQuery(api.orders.findAllBookingByCompanyId, {
      companyId: user.companyId as Id<"companies">,
    }),
    enabled: Boolean(user.companyId),
    select(data) {
      return data.filter((order) => order.poolRental)
    },
  })

  const country = countries.find(
    (c) => c.code === (user.company?.countryCode as string),
  )

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="bg-card space-y-2 rounded-lg border-2 p-8 shadow-md">
          <article className="flex justify-center">
            <ProfileAvatar
              userImage={user.image}
              userName={user.name}
              userEmail={user.email}
            />
          </article>
          <article className="font-medium">
            <p className="text-primary">Email</p>
            <p className="text-muted-foreground">{user.email}</p>
          </article>
          {user.name && (
            <article className="font-medium">
              <p className="text-primary">Name</p>
              <p className="text-muted-foreground capitalize">{user.name}</p>
            </article>
          )}
          {/* // Only me can access this! */}
          {user.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN ? (
            <article className="font-medium">
              <h2 className="text-primary">Role</h2>
              <p className="text-muted-foreground">{user.role}</p>
            </article>
          ) : (
            <article className="font-medium">
              <UpdateUserRoleForMeOnly
                id={user._id as Id<"users">}
                role={user.role}
              />
            </article>
          )}
        </section>
        <section className="bg-card space-y-4 rounded-lg border-2 p-8 font-medium shadow-md">
          <article className="flex flex-col items-center space-y-4">
            <Image
              src={country?.flag as string}
              width={500}
              height={500}
              alt={country?.country as string}
              className="h-16 w-28 rounded shadow"
            />
            {/* <Building2 className="text-primary size-10 shrink-0" /> */}
            <p className="text-2xl capitalize">{user.company?.name}</p>
          </article>
          <article className="flex items-center space-x-1 pt-4">
            <Phone size={20} className="text-primary mr-2 shrink-0" />
            <p className="text-muted-foreground">{user.company?.phone}</p>
          </article>
          <article className="flex items-center space-x-1">
            <MapPin size={20} className="text-primary mr-2 shrink-0" />
            <p className="text-muted-foreground space-x-1 text-balance capitalize">
              {user.company?.location}
            </p>
          </article>
          <article className="flex items-center space-x-1">
            <Layers size={20} className="text-primary mr-2 shrink-0" />
            <p className="text-muted-foreground space-x-1 text-balance capitalize">
              {user.company?.subscription} Subscription
            </p>
          </article>
          {adminAccessLevel && (
            <section className="space-y-4">
              <article className="flex items-center">
                <WrapperTooltip
                  side="right"
                  content="When enabled, it will activate the booking feature"
                >
                  <LayoutTemplate
                    size={20}
                    className="text-primary animate-pulse-slow mr-2 shrink-0"
                  />
                </WrapperTooltip>
                <p className="text-muted-foreground pr-2 text-balance capitalize">
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
              </article>
              <div className="flex items-center">
                <WrapperTooltip
                  side="right"
                  content="When enabled, it will activate the stockable feature"
                >
                  <Utensils
                    size={20}
                    className="text-primary animate-pulse-slow mr-2 shrink-0"
                  />
                </WrapperTooltip>
                <p className="text-muted-foreground pr-2 text-balance capitalize">
                  Stockable?
                </p>
                {bookingOrders.status === "success" && (
                  <ToggleStockable
                    companyId={user.companyId as Id<"companies">}
                    companyName={user.company?.name as string}
                    isStockable={user.company?.isStockable as boolean}
                  />
                )}
              </div>
              {user && user.company && (
                <UpdateCompanyInfo
                  adminAccessLevel={adminAccessLevel}
                  countries={countries}
                  companyId={user.companyId as Id<"companies">}
                  phone={user.company?.phone}
                  location={user.company?.location}
                  countryCode={user.company?.countryCode as string}
                  className="mt-4 w-full font-semibold"
                />
              )}
            </section>
          )}
        </section>
      </div>
    </div>
  )
}
