import { WrapperTooltip } from "@/components/wrapper-tooltip"
import Image from "next/image"

export const ContactBooking = ({
  BOOKING,
  poolTableName,
  width = 30,
  height = 30,
}: {
  BOOKING: string
  poolTableName: string
  width?: number
  height?: number
}) => (
  <WrapperTooltip content={`Booking Pool ${poolTableName}`} side="left">
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
  </WrapperTooltip>
)
