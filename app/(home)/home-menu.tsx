import { TabsContent } from "@/components/ui/tabs"
import { Tv, Utensils } from "lucide-react"
import { GiPoolTriangle } from "react-icons/gi"
import { AuthButtons } from "./auth-buttons"
import { DocumentationButton } from "./documentation-button"
import { Hero } from "./hero"
import { ShimmerButton } from "@/components/magicui/shimmer-button"

export const HomeContent = ({ slug }: { slug: string | null }) => (
  <TabsContent value="home" className="mt-12">
    <Hero />
    <section className="flex w-full items-center justify-between px-6 py-6 sm:hidden">
      <GiPoolTriangle className="animate-pulse-slow size-14 text-fuchsia-600 sm:size-16 lg:size-24" />
      <Utensils className="animate-pulse-slow size-12 text-fuchsia-600 sm:size-14 lg:size-[5rem]" />
    </section>
    <section className="flex flex-col items-center justify-center gap-4 sm:mt-8 sm:flex-row md:gap-8 lg:gap-16">
      <DocumentationButton
        icon={
          <GiPoolTriangle
            size={24}
            className="animate-pulse text-fuchsia-500"
          />
        }
        title="Documentation"
      />
      <ShimmerButton className="h-11">
        <a
          // href="https://www.youtube.com/playlist?list=PLnWWQuvB-wxg2PHPh4aybEZaqREqcrVuN"
          href="https://docs.qozycue.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center text-center"
        >
          <Tv className="mr-1.5 animate-pulse text-fuchsia-500" />
          Tutorial (WIP)
        </a>
      </ShimmerButton>
    </section>
    <section className="flex items-center justify-center gap-4">
      <AuthButtons slug={slug} />
    </section>
  </TabsContent>
)
