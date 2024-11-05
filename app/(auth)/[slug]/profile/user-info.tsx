"use client"

import { Building2, LayoutTemplate, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import { LoadingSpinner } from "@/app/_components/loading"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { env } from "@/env"
import { api } from "@/trpc/react"
import { TogglePublished } from "./toggle-published"
import { UpdateCompanyInfo } from "./update-company-info"
import { UpdateUserRoleForMeOnly } from "./update-user-role-for-me-only"

export function UserInfo({ isAdmin }: { isAdmin: boolean }) {
  const user = api.user.find.useQuery()

  const countAllBooking = api.order.countAllBooking.useQuery(undefined, {
    refetchInterval: 1000 * 10,
  })
  return (
    <div className="flex flex-col">
      {user.status === "pending" && <LoadingSpinner />}
      {user.status === "success" && (
        <div className="px-4">
          <Image
            src={user.data?.image as string}
            alt="Profile Image"
            width={500}
            height={500}
            className="size-32 rounded-full object-cover p-1 ring-2 ring-primary"
          />
          <section className="mt-6 space-y-2">
            <article>
              <h2 className="text-primary">Email</h2>
              <p className="text-muted-foreground">{user.data?.email}</p>
            </article>
            <article>
              <h2 className="text-primary">Name</h2>
              <p className="capitalize text-muted-foreground">
                {user.data?.name}
              </p>
            </article>
            <article>
              <h2 className="text-primary">Role</h2>
              {/* // Only me can access this! */}
              {user.data?.email === env.NEXT_PUBLIC_DEWA ? (
                <UpdateUserRoleForMeOnly
                  userId={user.data?.id}
                  userRole={user.data?.role}
                />
              ) : (
                <p className="text-muted-foreground">{user.data?.role}</p>
              )}
            </article>
            <Separator />
          </section>
          <section className="space-y-4 pt-4">
            <div className="flex space-x-1">
              <Building2 className="mr-2 shrink-0 text-primary" />
              <p className="space-x-1 capitalize text-muted-foreground">
                <span>{user.data?.company?.name}</span>
              </p>
            </div>
            <div className="flex space-x-1">
              <Phone className="mr-2 shrink-0 text-primary" />
              <p className="text-muted-foreground">
                {user.data?.company?.phone}
              </p>
            </div>
            <div className="flex space-x-1">
              <MapPin className="mr-2 shrink-0 text-primary" />
              <p className="space-x-1 text-balance capitalize text-muted-foreground">
                {user.data?.company?.location}
              </p>
            </div>
            {isAdmin && user.data?.company && (
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
                  <TogglePublished
                    companyId={user.data.company.id}
                    companyName={user.data.company.name}
                    isPublished={user.data?.company?.isPublished}
                    countAllBooking={countAllBooking.data!}
                  />
                </div>
                <UpdateCompanyInfo
                  isAdmin={isAdmin}
                  companyId={user.data.company.id}
                  phone={user.data.company.phone}
                  location={user.data.company.location}
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
