import { CONTACT } from "@/app/constants/contact"
import { TooltipTrigger } from "@/components/ui/tooltip"
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import Image from "next/image"

export const ContactDeveloperWhatsapp = () => (
  <div className="fixed right-2 bottom-2">
    <WrapperTooltip content="Contact Us">
      <TooltipTrigger>
        <a
          href={CONTACT}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-pulse-slow mx-2 inline-block"
        >
          <Image
            src="/images/icon-whatsapp.svg"
            alt="whatsapp-logo"
            width={50}
            height={50}
          />
        </a>
      </TooltipTrigger>
    </WrapperTooltip>
  </div>
)
