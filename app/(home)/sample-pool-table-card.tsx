import { Button } from "@/components/ui/button"
import { formattedPrice } from "@/lib/format-price"
import { ScrollText, TimerOff, UtensilsCrossed } from "lucide-react"

export const SamplePoolTableCard = ({ locale }: { locale: string }) => (
  <div className="font-mono">
    <div className="group relative px-1 pt-16">
      <div className="group-transition-colors motion-safe:animate-pulse-slow absolute -inset-[3px] top-16 h-44 w-full rounded-2xl bg-sky-400 blur-md duration-500 ease-in-out group-hover:blur-lg" />

      <div className="relative h-44 rounded-2xl bg-gradient-to-tr from-black from-30% via-zinc-900 via-50% to-black to-70% p-3 shadow">
        <section className="flex justify-between">
          {/* STARTS TIMER */}
          <div className="p-2">
            <div className="relative mr-3 size-[6rem] shrink-0 rounded-full bg-zinc-900 shadow-md ring-4 ring-sky-400 ring-offset-4 ring-offset-black">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* STARTS STOPWATCH */}
                {/* STARTS TIME CARD */}
                <div className="flex items-center justify-center text-lg font-semibold text-amber-400">
                  {/* STARTS FORMAT_TIME */}

                  <span>
                    <span className="sr-only">Hours</span>
                    <span>00</span>
                  </span>
                  <span>:</span>
                  <>
                    <span className="sr-only">Mins</span>
                    <span>45</span>
                  </>
                  <span>:</span>
                  <>
                    <span className="sr-only">Secs</span>
                    <span>30</span>
                  </>
                  {/* ENDS FORMAT_TIME */}
                </div>
                {/* ENDS TIME CARD */}
                {/* ENDS STOPWATCH */}
              </div>
            </div>
          </div>
          {/* ENDS TIMER */}
          {/* STARTS DESCRIPTION */}
          <section className="-ml-4">
            <h1 className="text-center font-bold text-amber-400 uppercase">
              Table 4
            </h1>
            <article className="text-muted-foreground mt-1 grid grid-cols-2 gap-x-2 text-xs sm:text-sm">
              <p className="text-right">Packet:</p>
              <p className="text-foreground capitalize">menit</p>
              <p className="text-right">Cost:</p>
              <p className="text-foreground tracking-tight">667.7</p>
              <p className="text-right">Duration:</p>
              <p className="text-amber-400">
                45<span className="ml-1">min</span>
              </p>
              <p className="text-right">Price:</p>

              <p className="text-amber-400">
                {formattedPrice(
                  locale,
                  Number(Math.round((666.7 * 45) / 100) * 100),
                )}
              </p>
            </article>
          </section>
          {/* ENDS DESCRIPTION */}
          {/* STARTS TIME_DISPLAY */}
          <article className="text-muted-foreground">
            <p className="text-foreground text-right text-sm">#cyque</p>
            <div className="mt-2 text-xs sm:text-sm">
              <p className="space-x-1 text-right uppercase">Start</p>
              <p className="tracking-tighter text-sky-400">14.16.33</p>
              <p className="space-x-1 text-right uppercase">End</p>
              <p className="tracking-tighter">--.--.--</p>
            </div>
          </article>
          {/* ENDS TIME_DISPLAY */}
          {/* STARTS LIST BUTTON */}

          <section className="absolute bottom-2.5 left-1/2 w-full -translate-x-1/2 font-sans">
            <div className="mx-2 flex justify-between sm:mx-3">
              {/* STARTS DETAIL BUTTON */}

              <Button
                variant="secondary"
                className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                <ScrollText size={20} />
                <span>Detail</span>
              </Button>
              {/* ENDS DETAIL BUTTON */}
              {/* STARTS STOP BUTTON */}
              <Button
                variant="secondary"
                className="space-x-2 text-red-500 disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                <TimerOff size={20} />
                <span>Stop</span>
              </Button>
              {/* ENDS STOP BUTTON */}
              {/* STARTS CAFE BUTTON */}
              <Button
                variant="secondary"
                className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                <UtensilsCrossed size={20} className="text-emerald-400" />
                <span>Cafe</span>
              </Button>
              {/* ENDS CAFE BUTTON */}
            </div>
          </section>
          {/* ENDS LIST BUTTON */}
        </section>
      </div>
    </div>
  </div>
)
