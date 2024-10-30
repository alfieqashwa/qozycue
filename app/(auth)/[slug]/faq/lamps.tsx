"use client"

import {
  LampCeiling,
  LampDesk,
  Lamp as LampIcon,
  Lightbulb,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Light = {
  icon: LucideIcon
  color: string
}
const lights: Light[] = [
  { icon: Lightbulb, color: "text-amber-200" },
  { icon: LampIcon, color: "text-sky-300" },
  { icon: LampDesk, color: "text-fuchsia-300" },
  { icon: LampCeiling, color: "text-teal-200" },
] as const

export function Lamps() {
  return (
    <div className="flex min-h-[calc(100vh_-_7rem)] flex-col items-center justify-center gap-20 lg:flex-row">
      {lights.map((l, i) => (
        <Lamp light={l} key={i} />
      ))}
      <DebuggingDeviceScreen />
    </div>
  )
}

const Lamp = ({ light }: { light: Light }) => {
  const [toggle, setToggle] = useState(false)
  return (
    <button onClick={() => setToggle((t) => (t = !t))}>
      <light.icon
        size={120}
        className={cn(toggle ? light.color : "text-muted-foreground")}
      />
    </button>
  )
}

const DebuggingDeviceScreen = () => {
  const [screenWidth, setScreenWidth] = useState<number | null>(null)
  const [screenHeight, setScreenHeight] = useState<number | null>(null)

  // Debugging dimension of device's screen
  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.screen.width)
      setScreenHeight(window.screen.height)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return (
    <article className="fixed bottom-16 space-y-1 rounded-md bg-muted/80 px-5 py-2 text-sm font-medium text-muted-foreground shadow">
      <p>Screen Width: {screenWidth}</p>
      <p>Screen Height: {screenHeight}</p>
    </article>
  )
}
