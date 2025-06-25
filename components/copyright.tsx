"use client"

import { Heart } from "lucide-react"
import { useScramble } from "use-scramble"
import packageJson from "../package.json"

export const Copyright = () => {
  const { ref, replay } = useScramble({
    text: "Alfie Qashwa",
    range: [65, 125],
    speed: 0.7,
    tick: 1,
    step: 1,
    scramble: 21,
    seed: 0,
    chance: 1,
    overdrive: false,
    overflow: true,
  })

  return (
    <div className="fixed bottom-0 z-50 w-full bg-gradient-to-b from-black/60 to-black pt-1 font-mono">
      <footer className="text-center text-xs leading-tight font-semibold tracking-wider text-zinc-400">
        <p className="whitespace-nowrap">
          <span>© {new Date().getFullYear()} Made with</span>
          <Heart
            className="mx-1 inline-block animate-pulse fill-rose-600 text-rose-500"
            size={16}
          />
          <span>by</span>
          <a
            ref={ref}
            onMouseOver={replay}
            onFocus={replay}
            href="https://github.com/alfieqashwa"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 whitespace-nowrap text-fuchsia-300 transition-colors duration-300 ease-in-out hover:text-fuchsia-400"
          />
        </p>
        <p className="text-center text-xs font-semibold tracking-wider">
          Version: {packageJson.version}
        </p>
      </footer>
    </div>
  )
}
