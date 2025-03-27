import { Switch } from "@/components/ui/switch"
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Status } from "@/types"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

//? Product
export function ToggleProduct({
  id,
  name,
  status,
  countInStock,
}: {
  id: Id<"products">
  name: string
  status: Status
  countInStock: number
}) {
  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const managerAccessLevel = ["DEWA", "ADMIN", "MANAGER"].includes(
    me.data?.role ?? "",
  )

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.products.toggle),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p>
            {variables?.toggleProductSchema.status !== "enabled"
              ? "Enabled"
              : "Disabled"}{" "}
            {name}
          </p>
        ),
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  return (
    <>
      {countInStock === 0 ? (
        <WrapperTooltip content="Out of stock">
          <div>
            <Switch
              disabled={!managerAccessLevel || isPending || countInStock === 0}
              checked={false}
            />
          </div>
        </WrapperTooltip>
      ) : (
        <Switch
          disabled={!managerAccessLevel || isPending}
          checked={status === "enabled" ? true : false}
          onCheckedChange={() =>
            mutate({
              toggleProductSchema: {
                id,
                status,
              },
            })
          }
        />
      )}
    </>
  )
}
