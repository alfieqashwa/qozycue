import { Switch } from "@/components/ui/switch"
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

//? Packet
export function TogglePacket({
  id,
  name,
  status,
}: {
  id: Id<"packets">
  name: string
  status: Status
}) {
  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const managerAccessLevel =
    me.data?.role === "ZENITH" ||
    me.data?.role === "ADMIN" ||
    me.data?.role === "MANAGER"

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.packets.toggle),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p>
            {variables?.togglePacketSchema.status !== "enabled"
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
    <Switch
      disabled={!managerAccessLevel || isPending}
      checked={status === "enabled" ? true : false}
      onCheckedChange={() => mutate({ togglePacketSchema: { id, status } })}
    />
  )
}
