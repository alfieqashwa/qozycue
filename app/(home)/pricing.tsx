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

const PricingHeader = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => (
  <section className="text-center">
    <h2 className="text-3xl font-bold">{title}</h2>
    <p className="pt-1 font-semibold text-zinc-400 md:text-lg">{subtitle}</p>
    <br />
  </section>
)

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="mx-auto w-40" onValueChange={onSwitch}>
    <TabsList className="space-x-1">
      <TabsTrigger value="0" className="font-medium">
        Monthly
      </TabsTrigger>
      <TabsTrigger value="1" className="font-medium">
        Yearly
      </TabsTrigger>
    </TabsList>
  </Tabs>
)

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
  <Card
    className={cn(
      `flex w-72 flex-col justify-between py-1 ${popular ? "border-rose-400" : "border-zinc-700"} mx-auto border-2 shadow-md sm:mx-0`,
      {
        "animate-shimmer bg-black bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] transition-colors":
          exclusive,
      },
    )}
  >
    <div>
      <CardHeader className="pt-4 pb-8">
        {isYearly && yearlyPrice && monthlyPrice ? (
          <div className="flex justify-between">
            <CardTitle className="text-lg text-zinc-300">{title}</CardTitle>
            <div
              className={cn(
                "h-fit rounded-xl bg-zinc-200 px-2.5 py-1 text-xs text-black dark:bg-zinc-800 dark:text-white",
                {
                  "bg-gradient-to-r from-orange-400 to-rose-400 dark:text-black":
                    popular,
                },
              )}
            >
              {title === "Basic"
                ? `Save ${monthlyPrice * 12 - yearlyPrice} ribu`
                : `Save ${(monthlyPrice * 12 - yearlyPrice) / 1000} juta`}
            </div>
          </div>
        ) : (
          <CardTitle className="text-lg text-zinc-300">{title}</CardTitle>
        )}
        <div className="flex gap-0.5">
          <h3 className="text-3xl font-bold">
            {yearlyPrice && isYearly
              ? yearlyPrice / 1000 + "jt"
              : monthlyPrice
                ? monthlyPrice + "rb"
                : "Custom"}
          </h3>
          <span className="mb-1 flex flex-col justify-end text-sm">
            {yearlyPrice && isYearly ? "/year" : monthlyPrice ? "/month" : null}
          </span>
        </div>
        <CardDescription className="h-12 pt-1.5">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {features.map((feature: string) => (
          <CheckItem key={feature} text={feature} />
        ))}
      </CardContent>
    </div>
    <CardFooter className="mt-2">
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
    </CardFooter>
  </Card>
)

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex gap-2">
    <CheckCircle2 size={18} className="my-auto shrink-0 text-green-400" />
    <p className="pt-0.5 text-sm text-zinc-300">{text}</p>
  </div>
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
      monthlyPrice: 500_000 / 1000,
      yearlyPrice: 5_000_000 / 1000,
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
    <div className="py-20 lg:py-12">
      <PricingHeader
        title="Pricing Plans"
        subtitle="Choose the plan that's right for you"
      />
      <PricingSwitch onSwitch={togglePricingPeriod} />
      <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {plans.map((plan) => {
          return <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
        })}
      </section>
    </div>
  )
}
