import { cn } from "@/lib/utils"
import { Utensils } from "lucide-react"
import { GiPoolTriangle } from "react-icons/gi"

const QOZY_CUE = ["Q", "o", "z", "y", " ", "C", "u", "e"]

export const Hero = () => (
  <div className="mt-40">
    <p className="text-center text-6xl font-black tracking-wider text-white sm:text-7xl lg:text-8xl">
      {QOZY_CUE.map((q, i) => (
        <span
          className={cn(
            "bg-gradient-to-t from-foreground/50 from-20% to-foreground to-50% bg-clip-text text-transparent shadow-lg",
            q === "z" &&
              "from-pink-700 from-20% to-fuchsia-600 to-50% motion-safe:animate-pulse-slow",
          )}
          key={i}
        >
          {q}
        </span>
      ))}
    </p>
    <section className="mt-8 flex w-full items-center justify-center space-x-1.5 sm:space-x-12 md:space-x-24 lg:space-x-32">
      <GiPoolTriangle className="size-14 animate-pulse-slow text-fuchsia-600 sm:size-16 lg:size-24" />
      <article className="text-center">
        <p className="whitespace-nowrap bg-gradient-to-t from-foreground/50 from-20% to-foreground to-50% bg-clip-text text-2xl font-black tracking-widest text-transparent lg:text-4xl">
          Billiard & Cafe
        </p>
        <p className="whitespace-nowrap bg-gradient-to-t from-foreground/80 to-foreground bg-clip-text font-semibold tracking-widest text-transparent lg:text-xl">
          Online and{" "}
          <span className="bg-gradient-to-t from-pink-700 from-20% to-fuchsia-600 to-50% bg-clip-text text-transparent shadow-lg motion-safe:animate-pulse-slow">
            Real Time
          </span>{" "}
          Application
        </p>
      </article>
      <Utensils className="size-12 animate-pulse-slow text-fuchsia-600 sm:size-14 lg:size-[5rem]" />
    </section>
  </div>
)
