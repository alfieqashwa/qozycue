import { SUBSCRIPTION } from "@/app/constants/subscription"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Info } from "lucide-react"

export const SubscriptionInfo = ({
  subscription,
}: {
  subscription: "TRIAL" | "BASIC" | "PRO" | "ENTERPRISE" | undefined
}) => (
  <Dialog>
    <DialogTrigger asChild className="">
      <Info className="text-primary animate-pulse-slow inline-block hover:cursor-pointer" />
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{subscription}</DialogTitle>
        <DialogDescription>
          Limits for pool tables, products, and packets in this tier.
        </DialogDescription>
      </DialogHeader>
      <ul className="divide-muted bg-muted/30 divide-y rounded-md border p-4">
        {SUBSCRIPTION.filter((sub) => sub.type === subscription).map(
          (sub, i) => (
            <li key={i} className="py-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">
                  Pool Tables
                </span>
                <span>{sub.poolTables} tables</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">
                  Products
                </span>
                <span>{sub.products} products</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">
                  Packets
                </span>
                <span>{sub.packets} packets</span>
              </div>
            </li>
          ),
        )}
      </ul>
      <DialogFooter className="mt-2 border-t pt-4 text-end">
        <p className="text-muted-foreground text-xs">
          <a
            href="https://docs.qozycue.com/guides/subscriptions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1 underline-offset-4 transition-colors hover:underline"
          >
            Reference Docs
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 7l-10 10M7 7h10v10"
              />
            </svg>
          </a>
        </p>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
