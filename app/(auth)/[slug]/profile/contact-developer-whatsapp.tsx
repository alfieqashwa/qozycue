import Image from "next/image"
import { CONTACT } from "@/app/constants/contact"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const ContactDeveloperWhatsapp = () => (
  <div className="fixed bottom-2 right-2">
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 inline-block animate-pulse-slow"
        >
          <Image
            src="/images/icon-whatsapp.svg"
            alt="whatsapp-logo"
            width={50}
            height={50}
          />
        </a>
      </TooltipTrigger>
      <TooltipContent className="font-medium">Contact Us</TooltipContent>
    </Tooltip>
  </div>
)
