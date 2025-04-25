import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"

export const ContactBooking = ({
  BOOKING,
  poolTableName,
  width = 30,
  height = 30,
  side = "top",
}: {
  BOOKING: string
  poolTableName: string
  width?: number
  height?: number
  side?: "top" | "right" | "bottom" | "left"
}) => (
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
          width={width}
          height={height}
          className="size-8 animate-pulse rounded-tr-none rounded-br-2xl rounded-bl-none"
        />
      </a>
    </TooltipTrigger>
    <TooltipContent side={side} className="bg-muted flex items-center gap-4">
      <span className="text-muted-foreground text-xs whitespace-nowrap capitalize">
        Booking Pool {poolTableName}
      </span>
    </TooltipContent>
  </Tooltip>
)
