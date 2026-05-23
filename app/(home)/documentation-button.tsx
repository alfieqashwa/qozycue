"use client"

import { HoverBorderGradient } from "@/components/hover-border-gradient"

type Props = {
  icon: React.ReactNode
  title: string
}
export function DocumentationButton({ icon, title }: Props) {
  return (
    <a
      href="https://docs-qozycue.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-center text-center"
    >
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="flex items-center space-x-2 bg-black text-white"
      >
        {icon}
        <span className="font-semibold whitespace-nowrap">{title}</span>
      </HoverBorderGradient>
    </a>
  )
}
