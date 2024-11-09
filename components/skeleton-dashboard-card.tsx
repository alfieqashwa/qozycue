import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export const SkeletonDashboardCard = ({
  className,
}: {
  className?: string
}) => <Skeleton className={cn("h-full w-full rounded-xl border", className)} />
