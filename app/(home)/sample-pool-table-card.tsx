import { Button } from "@/components/ui/button"
import { formattedPrice } from "@/lib/format-price"
import { ScrollText, TimerOff, UtensilsCrossed } from "lucide-react"
import { motion } from "motion/react"

export const SamplePoolTableCard = ({ locale }: { locale: string }) => (
  <div className="font-mono">
    <motion.div
      className="group relative px-1 pt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <motion.div
        className="absolute -inset-[3px] top-16 h-44 w-full rounded-2xl bg-sky-400 blur-md"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="relative h-44 rounded-2xl bg-gradient-to-tr from-black from-30% via-zinc-900 via-50% to-black to-70% p-3 shadow"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <section className="flex justify-between">
          {/* TIMER */}
          <motion.div
            className="p-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="relative mr-3 size-[6rem] shrink-0 rounded-full bg-zinc-900 shadow-md ring-4 ring-sky-400 ring-offset-4 ring-offset-black"
              animate={{
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 0 0 rgba(56, 189, 248, 0.4)",
                  "0 0 20px rgba(56, 189, 248, 0.6)",
                  "0 0 0 rgba(56, 189, 248, 0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="flex items-center justify-center text-lg font-semibold text-amber-400"
                  animate={{
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <span>00</span>
                  <span>:</span>
                  <span>45</span>
                  <span>:</span>
                  <span>30</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* DESCRIPTION */}
          <motion.section
            className="-ml-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h1
              className="text-center font-bold text-amber-400 uppercase"
              whileHover={{ scale: 1.1 }}
            >
              Table 4
            </motion.h1>
            <motion.article
              className="text-muted-foreground mt-1 grid grid-cols-2 gap-x-2 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
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
            </motion.article>
          </motion.section>

          {/* TIME DISPLAY */}
          <motion.article
            className="text-muted-foreground"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-foreground text-right text-sm">#cyque</p>
            <div className="mt-2 text-xs sm:text-sm">
              <p className="space-x-1 text-right uppercase">Start</p>
              <p className="tracking-tighter text-sky-400">14.16.33</p>
              <p className="space-x-1 text-right uppercase">End</p>
              <p className="tracking-tighter">--.--.--</p>
            </div>
          </motion.article>

          {/* BUTTONS */}
          <motion.section
            className="absolute bottom-2.5 left-1/2 w-full -translate-x-1/2 font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mx-2 flex justify-between sm:mx-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <ScrollText size={20} />
                  <span>Detail</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  className="space-x-2 text-red-500 disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <TimerOff size={20} />
                  <span>Stop</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <UtensilsCrossed size={20} className="text-emerald-400" />
                  <span>Cafe</span>
                </Button>
              </motion.div>
            </div>
          </motion.section>
        </section>
      </motion.div>
    </motion.div>
  </div>
)
