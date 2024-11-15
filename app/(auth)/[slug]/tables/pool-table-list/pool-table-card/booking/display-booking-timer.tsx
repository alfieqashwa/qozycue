import { AlarmClock } from "lucide-react"

export const DisplayBookingTimer = ({
  minutes,
  seconds,
}: {
  minutes: number
  seconds: number
}) => (
  <div className="hover:bg-primary-50 absolute left-[30px] top-0 z-50 flex animate-pulse rounded-r-sm bg-primary/30 px-2.5 py-1 text-primary shadow-xl">
    <AlarmClock size={16} className="mr-2 mt-0.5 animate-bounce" />
    <p className="text-sm font-medium tracking-wider">
      {/* {hours.toString().padStart(2, "0")}: */}
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </p>
  </div>
)
