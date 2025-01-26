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
          className="animate-pulse"
        />
      </a>
    </TooltipTrigger>
    <TooltipContent side={side} className="flex items-center gap-4 bg-muted">
      <span className="whitespace-nowrap text-xs capitalize text-muted-foreground">
        Booking Pool {poolTableName}
      </span>
    </TooltipContent>
  </Tooltip>
)
