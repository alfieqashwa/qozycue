import { NotepadText } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { ScrollArea } from "~/components/ui/scroll-area"
import { api } from "~/trpc/react"
import { WaitingList } from "./waiting-list"

export function WaitingListDrawer({
  poolTableId,
  poolTableName,
}: {
  poolTableId: string
  poolTableName: string
}) {
  const { data: bookingList, status } =
    api.poolRental.findAllBookingByCompanyIdPublic.useQuery(
      { poolTableId },
      {
        enabled: Boolean(poolTableId),
        refetchInterval: 1000 * 10, // 10 secs
      },
    )
  return (
    <section className="mt-2 flex items-center justify-center">
      {status === "success" && !!bookingList.length && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="group/button space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              <NotepadText
                size={20}
                className="text-muted-foreground transition-colors duration-300 ease-in-out group-hover/button:text-foreground"
              />
              <span className="whitespace-nowrap text-sm font-semibold capitalize">
                {bookingList.length} waiting list
              </span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="mx-auto min-w-[360px] max-w-xl bg-card px-6">
            <DrawerHeader className="flex justify-center">
              <DrawerTitle className="whitespace-nowrap text-base md:text-lg">
                Table {poolTableName}
              </DrawerTitle>
            </DrawerHeader>
            <section className="grid grid-cols-6 py-1 text-xs font-medium text-muted-foreground md:py-2 md:text-sm">
              <div className="col-span-1">No</div>
              <div className="col-span-2 text-center">Start Time</div>
              <div className="col-span-2 text-center">End Time</div>
              <div className="col-span-1 text-center">Duration</div>
            </section>
            <ScrollArea className="-mx-4 h-[calc(100vh_-_17rem)] px-4">
              {bookingList.map((r, idx) => (
                <WaitingList
                  idx={idx}
                  startTime={r.timeStart}
                  endTime={r.timeEnd}
                  duration={r.duration}
                  key={idx}
                />
              ))}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </section>
  )
}
