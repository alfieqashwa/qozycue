import { cn } from "@/lib/utils"
import { Utensils } from "lucide-react"
import { GiPoolTriangle } from "react-icons/gi"

const QOZY_CUE = ["Q", "o", "z", "y", " ", "C", "u", "e"]

export const Hero = () => (
  <div>
    <p className="text-center text-6xl font-black tracking-wider text-white sm:text-7xl lg:text-8xl">
      {QOZY_CUE.map((q, i) => (
        <span
          className={cn(
            "from-foreground/50 to-foreground bg-linear-to-t from-20% to-50% bg-clip-text text-transparent shadow-lg",
            q === "z" &&
              "motion-safe:animate-pulse-slow from-pink-700 from-20% to-fuchsia-600 to-50%",
          )}
          key={i}
        >
          {q}
        </span>
      ))}
    </p>
    <section className="mt-8 flex w-full items-center justify-center space-x-1.5 sm:space-x-12 md:space-x-24 lg:space-x-32">
      <GiPoolTriangle className="animate-pulse-slow hidden size-14 text-fuchsia-600 sm:block sm:size-16 lg:size-24" />
      <article className="text-center">
        <p className="from-foreground/50 to-foreground bg-linear-to-t from-20% to-50% bg-clip-text text-2xl font-black tracking-widest whitespace-nowrap text-transparent lg:text-4xl">
          Billiard & Cafe
        </p>
        <p className="from-foreground/80 to-foreground mt-1 bg-linear-to-t bg-clip-text font-bold tracking-widest whitespace-nowrap text-transparent lg:text-xl">
          Online and{" "}
          <span className="motion-safe:animate-pulse-slow bg-linear-to-t from-pink-700 from-20% to-fuchsia-600 to-50% bg-clip-text text-transparent shadow-lg">
            Real Time
          </span>{" "}
          Application
        </p>
      </article>
      <Utensils className="animate-pulse-slow hidden size-12 text-fuchsia-600 sm:block sm:size-14 lg:size-[5rem]" />
    </section>
  </div>
)
