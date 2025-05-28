"use client"

import { motion, useMotionValueEvent, useScroll } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const StickyScrollDesktopView = ({
  content,
  contentClassName,
}: {
  content: {
    title: string
    description: string
    content?: React.ReactNode | any
  }[]
  contentClassName?: string
}) => {
  const [activeCard, setActiveCard] = React.useState(0)
  const ref = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref,
    container: ref,
    offset: ["start start", "end start"],
  })
  const cardLength = content.length

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength)
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint)
        if (distance < Math.abs(latest - cardsBreakpoints[acc]!)) {
          return index
        }
        return acc
      },
      0,
    )
    setActiveCard(closestBreakpointIndex)
  })

  const backgroundColors = [
    "var(--zinc-950)",
    "var(--black)",
    "var(--neutral-900)",
  ]
  const linearGradients = [
    "linear-gradient(to bottom right, var(--black, var(--black))",
    "linear-gradient(to bottom right, var(--black, var(--black))",
    "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
    "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
  ]

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  )

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard])

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-md"
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="mt-10 max-w-sm text-lg text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-10 hidden h-80 w-96 overflow-hidden rounded-3xl bg-white md:block",
          contentClassName,
        )}
      >
        {content[activeCard]?.content ?? null}
      </div>
      {/* <motion.div
        animate={{
          background: linearGradients[activeCard % linearGradients.length],
        }}
        className={cn(
          "sticky top-10 hidden h-80 w-96 overflow-hidden rounded-3xl bg-white md:block",
          contentClassName,
        )}
      >
        {content[activeCard]?.content ?? null}
      </motion.div> */}
    </motion.div>
  )
}

export const StickyScrollMobileView = ({
  content,
}: {
  content: {
    title: string
    description: string
    content?: React.ReactNode | any
  }[]
  contentClassName?: string
}) => {
  return (
    <div className="relative flex justify-center space-x-10 overflow-y-auto rounded-md">
      <div className="max-w-2xl px-1">
        {content.map((item, index) => (
          <div key={item.title + index} className="my-20">
            <h2 className="px-2 text-2xl font-bold text-slate-100">
              {item.title}
            </h2>
            <p className="mt-8 max-w-sm px-2 text-lg text-slate-300 sm:max-w-md">
              {item.description}
            </p>
            <div className={cn("mt-8 h-80 max-w-md")}>
              {item.content ?? null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
