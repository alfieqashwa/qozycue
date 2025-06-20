"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { PHONE } from "../constants/contact"

type PricingSwitchProps = {
  onSwitch: (value: string) => void
}

type PricingCardProps = {
  isYearly?: boolean
  title: string
  monthlyPrice?: number
  yearlyPrice?: number
  description: string
  features: string[]
  actionLabel: string
  popular?: boolean
  exclusive?: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      duration: 0.8,
    },
  },
}

const featureVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    scale: 0.9,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      delay: index * 0.1,
    },
  }),
}

const priceChangeVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
}

const badgeVariants = {
  initial: {
    opacity: 0,
    x: 30,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 12,
      delay: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 30,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
}

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => (
  <motion.section
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8,
    }}
    className="overflow-hidden text-center"
  >
    <motion.h2
      className="text-3xl font-bold"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      {title}
    </motion.h2>
    <motion.p
      className="pt-1 font-semibold text-zinc-400 md:text-lg"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      {subtitle}
    </motion.p>
    <br />
  </motion.section>
)

const MotionTabs = motion.create(Tabs)

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <MotionTabs
    defaultValue="0"
    onValueChange={onSwitch}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      delay: 0.6,
      duration: 0.5,
      type: "spring",
      stiffness: 120,
      damping: 15,
    }}
    className="mx-auto w-40 overflow-hidden"
  >
    <TabsList className="space-x-1">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <TabsTrigger value="0" className="font-medium">
          Monthly
        </TabsTrigger>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <TabsTrigger value="1" className="font-medium">
          Yearly
        </TabsTrigger>
      </motion.div>
    </TabsList>
  </MotionTabs>
)

const MotionCard = motion.create(Card)

const PricingCard = ({
  isYearly,
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
}: PricingCardProps) => (
  <MotionCard
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover={{
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      `flex w-72 flex-col justify-between py-1 ${popular ? "border-rose-400" : "border-zinc-700"} mx-auto overflow-hidden border-[3px] shadow-lg will-change-transform sm:mx-0`,
      {
        "animate-shimmer bg-black bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
          exclusive,
      },
    )}
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={isYearly ? "yearly" : "monthly"}
        variants={priceChangeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <CardHeader className="pt-4 pb-8">
          {isYearly && yearlyPrice && monthlyPrice ? (
            <div className="flex justify-between">
              <CardTitle className="text-lg text-zinc-300">{title}</CardTitle>
              <motion.div
                variants={badgeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={cn(
                  "h-fit rounded-xl bg-zinc-200 px-2.5 py-1 text-xs font-medium text-black dark:bg-zinc-800 dark:text-white",
                  {
                    "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black":
                      popular,
                  },
                )}
              >
                {title === "Basic"
                  ? `Save ${monthlyPrice * 12 - yearlyPrice} ribu`
                  : `Save ${(monthlyPrice * 12 - yearlyPrice) / 1000} juta`}
              </motion.div>
            </div>
          ) : (
            <CardTitle className="py-1">{title}</CardTitle>
          )}
          <motion.div
            key={isYearly && yearlyPrice ? "yearly" : "monthly"}
            variants={priceChangeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex gap-0.5"
          >
            <motion.h3
              className="text-3xl font-bold"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.1,
              }}
            >
              {yearlyPrice && isYearly
                ? yearlyPrice / 1000 + "jt"
                : monthlyPrice
                  ? monthlyPrice + "rb"
                  : "Custom"}
            </motion.h3>
            <motion.span
              className="mb-1 flex flex-col justify-end text-sm"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {yearlyPrice && isYearly
                ? "/year"
                : monthlyPrice
                  ? "/month"
                  : null}
            </motion.span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardDescription className="h-12 pt-1.5">
              {description}
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string, idx) => (
            <CheckItem key={idx} text={feature} index={idx} />
          ))}
        </CardContent>
      </motion.div>
    </AnimatePresence>
    <CardFooter className="mt-2">
      <motion.div
        className="w-full"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {title === "Enterprise" ? (
          <a
            href={`https://wa.me/${PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground text-muted hover:bg-foreground/75 inline-flex w-full items-center justify-center rounded-md px-6 py-2 font-medium transition-colors focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
          >
            {actionLabel}
          </a>
        ) : (
          <Link
            href="/portal"
            className="bg-foreground text-muted hover:bg-foreground/75 relative inline-flex w-full items-center justify-center rounded-md px-6 py-2 font-medium transition-colors focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
          >
            <div className="rounded-lg" />
            {actionLabel}
          </Link>
        )}
      </motion.div>
    </CardFooter>
  </MotionCard>
)

const CheckItem = ({ text, index }: { text: string; index: number }) => (
  <motion.div
    custom={index}
    variants={featureVariants}
    initial="hidden"
    animate="visible"
    whileHover={{
      x: 5,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    }}
    className="flex gap-2 will-change-transform"
  >
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        delay: index * 0.1 + 0.5,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      <CheckCircle2 size={18} className="my-auto shrink-0 text-green-400" />
    </motion.div>
    <motion.p
      className="pt-0.5 text-sm text-zinc-300"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 + 0.6 }}
    >
      {text}
    </motion.p>
  </motion.div>
)

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const togglePricingPeriod = (value: string) =>
    setIsYearly(parseInt(value) === 1)

  const plans = [
    {
      title: "Basic",
      monthlyPrice: 300_000 / 1000,
      yearlyPrice: 3_000_000 / 1000,
      description: "Essential features you need to get started",
      features: ["Max 20 pool tables", "Max 7 users", "Maintainance & Service"],
      actionLabel: "Get Started",
    },
    {
      title: "Pro",
      monthlyPrice: 450_000 / 1000,
      yearlyPrice: 4_400_000 / 1000,
      description: "Perfect for owners of small & medium businessess",
      features: [
        "Max 40 pool tables",
        "Max 10 users",
        "Maintainance & Service",
      ],
      actionLabel: "Get Started",
      popular: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "Dedicated support and infrastructure to fit your needs",
      features: [
        "One-time purchase",
        "60 - 80 pool tables",
        "15 - 20 users",
        "Maintainance & Service",
      ],
      actionLabel: "Contact Sales",
      exclusive: true,
    },
  ]

  return (
    <div className="overflow-hidden py-20 lg:py-12">
      <PricingHeader
        title="Pricing Plans"
        subtitle="Choose the plan that's right for you"
      />
      <PricingSwitch onSwitch={togglePricingPeriod} />
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap"
      >
        {plans.map((plan) => {
          return <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
        })}
      </motion.section>
    </div>
  )
}
