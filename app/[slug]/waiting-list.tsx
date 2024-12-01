import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Separator } from "~/components/ui/separator"

type WaitingListProps = {
  idx: number
  startTime: Date | null
  endTime: Date | null
  duration: number | null
}

export function WaitingList({
  idx,
  startTime,
  endTime,
  duration,
}: WaitingListProps) {
  return (
    <>
      <section className="grid grid-cols-6 py-1 text-xs font-medium md:py-2 md:text-sm">
        <p className="col-span-1">{idx + 1}.</p>
        <p className="col-span-2 text-center text-sky-400">
          {startTime && format(startTime, "dd MMM : p", { locale: id })}
        </p>
        <p className="col-span-2 text-center text-amber-400">
          {endTime && format(endTime, "dd MMM : p", { locale: id })}
        </p>
        <p className="col-span-1 space-x-1 text-center">
          <span className="uppercase text-sky-400">{duration}</span>
          <span className="text-muted-foreground">
            {duration! > 1 ? "hrs" : "hr"}
          </span>
        </p>
      </section>
      <Separator className="my-0.5" />
    </>
  )
}
