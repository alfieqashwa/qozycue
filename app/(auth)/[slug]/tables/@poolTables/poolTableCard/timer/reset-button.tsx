import { Id } from "@/convex/_generated/dataModel"

export function ResetButton({
  poolTableId,
  poolTableName,
  orderId,
  disabled,
}: {
  poolTableId: Id<"poolTables">
  poolTableName: string
  orderId: Id<"orders"> | undefined
  disabled: boolean
}) {
  return <div>Reset Button</div>
}
