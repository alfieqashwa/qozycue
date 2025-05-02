"use client"

import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { countries } from "@/lib/countries"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Preloaded, usePreloadedQuery } from "convex/react"
import { FunctionReturnType } from "convex/server"
import {
  HandCoins,
  Layers,
  LayoutTemplate,
  MapPin,
  Phone,
  Utensils,
} from "lucide-react"
import Image from "next/image"
import { ProfileAvatar } from "./profile-avatar"
import { TogglePublished } from "./toggle-published"
import { ToggleStockable } from "./toggle-stockable"
import { UpdateCompanyInfo } from "./update-company-info"
import { UpdateUserRoleForMeOnly } from "./update-user-role-for-me-only"

export function UserProfile({
  preloadedSession,
}: {
  preloadedSession: Preloaded<typeof api.sessions.find>
}) {
  const { user } = usePreloadedQuery(preloadedSession)
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* User Card */}
        <UserProfileCard user={user} />
        {/* Company Card */}
        <CompanyProfileCard user={user} />
      </div>
    </div>
  )
}

const UserProfileCard = ({
  user,
}: {
  user: FunctionReturnType<typeof api.sessions.find>["user"]
}) => (
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
)

const CompanyProfileCard = ({
  user,
}: {
  user: FunctionReturnType<typeof api.sessions.find>["user"]
}) => {
  const adminAccessLevel = ["ZENITH", "ADMIN"].includes(user.role ?? "")

  const country = countries.find(
    (c) => c.code === (user.company?.countryCode as string),
  )

  const bookingOrders = useTanstackQuery({
    ...convexQuery(api.orders.findAllBookingByCompanyId, {
      companyId: user.companyId as Id<"companies">,
    }),
    enabled: Boolean(user.companyId),
    select(data) {
      return data.filter((order) => order.poolRental)
    },
  })

  return (
    <section className="bg-card rounded-lg border-2 p-8 font-medium shadow-md">
      <article className="flex flex-col items-center">
        <Image
          src={country?.flag as string}
          width={500}
          height={500}
          alt={country?.country as string}
          className="animate-pulse-slow h-16 w-28 rounded shadow"
        />
        <p className="pt-2 text-2xl capitalize">{user.company?.name}</p>
      </article>
      <div className="grid-clos-1 grid gap-8 pt-8 lg:grid-cols-2">
        <section className="space-y-4">
          <article className="flex items-center space-x-1">
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
            <HandCoins size={20} className="text-primary mr-2 shrink-0" />
            <p className="text-muted-foreground space-x-1 text-balance capitalize">
              {country?.currency as string}
            </p>
          </article>
        </section>
        <section className="space-y-4">
          <article className="flex items-center space-x-1">
            <Layers size={20} className="text-primary mr-2 shrink-0" />
            <p className="text-muted-foreground space-x-1 text-balance capitalize">
              {user.company?.subscription} Subscription
            </p>
          </article>
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
                adminAccessLevel={adminAccessLevel}
                companyId={user.companyId as Id<"companies">}
                companyName={user.company?.name as string}
                isPublished={user.company?.isPublished as boolean}
                countAllBooking={!!bookingOrders.data.length}
              />
            )}
          </article>
          <article className="flex items-center">
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
                adminAccessLevel={adminAccessLevel}
                companyId={user.companyId as Id<"companies">}
                companyName={user.company?.name as string}
                isStockable={user.company?.isStockable as boolean}
              />
            )}
          </article>
        </section>
      </div>
      {user && user.company && (
        <UpdateCompanyInfo
          adminAccessLevel={adminAccessLevel}
          countries={countries}
          companyId={user.companyId as Id<"companies">}
          phone={user.company?.phone}
          location={user.company?.location}
          countryCode={user.company?.countryCode as string}
          className="mt-10 w-full font-semibold"
        />
      )}
    </section>
  )
}
