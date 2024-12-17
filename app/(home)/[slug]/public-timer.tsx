"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function PublicTimer({
  companyName,
  companyPhone,
  websitelink,
  isActive,
  poolTableName,
  hasEndTime,
  children,
}: {
  companyName: string
  companyPhone: string
  websitelink: string
  isActive: boolean
  poolTableName: string
  hasEndTime: boolean
  children: React.ReactNode
}) {
  const SPACE = "%20"
  const BOOKING = `https://wa.me/${companyPhone}?text=Hi${SPACE}${companyName.toLocaleUpperCase()}.${SPACE}Saya${SPACE}mau${SPACE}pesan${SPACE}meja${SPACE}${poolTableName}.${SPACE}Bagaimana${SPACE}cara${SPACE}pembayarannya?${SPACE}Thanks!${SPACE}${websitelink}`

  return (
    <div className="p-2">
      <div
        className={cn(
          "relative size-[6rem] shrink-0 rounded-full bg-zinc-900 p-2 shadow-md",
          isActive && "mx-1 ring-4 ring-offset-4 ring-offset-black",
          hasEndTime ? "ring-muted" : "ring-sky-400",
        )}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {isActive ? (
            children
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={BOOKING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <Image
                    src="/images/icon-whatsapp.svg"
                    alt="whatsapp-logo"
                    width={30}
                    height={30}
                    className="animate-pulse"
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent className="flex items-center gap-4 bg-muted">
                <span className="whitespace-nowrap text-xs capitalize text-muted-foreground">
                  Booking Pool {poolTableName}
                </span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
