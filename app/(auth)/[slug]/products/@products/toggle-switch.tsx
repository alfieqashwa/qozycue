import { Status } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"

//? Product
export function ToggleSwitchProduct({
  id,
  name,
  status,
}: {
  id: string
  name: string
  status: Status
}) {
  const router = useRouter()
  const { toast } = useToast()

  const me = api.user.me.useQuery()
  const managerAccessLevel =
    me.data?.role === "DEWA" ||
    me.data?.role === "ADMIN" ||
    me.data?.role === "MANAGER"

  const { mutate, isPending } = api.product.toggle.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: (
          <p>
            <span>{status === Status.disabled ? "Enabled" : "Disabled"}</span>
            <span className="pl-1 font-medium uppercase text-primary">
              {name}
            </span>
          </p>
        ),
      })
      router.refresh()
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  return (
    <Switch
      disabled={!managerAccessLevel || isPending}
      checked={status === Status.enabled ? true : false}
      onCheckedChange={() =>
        mutate({
          id,
          status: status === Status.disabled ? "enabled" : "disabled",
        })
      }
    />
  )
}

//? Packet
export function ToggleSwitchPacket({
  id,
  name,
  status,
}: {
  id: string
  name: string
  status: Status
}) {
  const router = useRouter()
  const { toast } = useToast()

  const me = api.user.me.useQuery()
  const managerAccessLevel =
    me.data?.role === "DEWA" ||
    me.data?.role === "ADMIN" ||
    me.data?.role === "MANAGER"

  const { mutate, isPending } = api.packet.toggle.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: (
          <p>
            <span>{status === "disabled" ? "Enabled" : "Disabled"}</span>
            <span className="pl-1 font-medium uppercase text-primary">
              {name}
            </span>
          </p>
        ),
      })
      router.refresh()
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  return (
    <Switch
      disabled={!managerAccessLevel || isPending}
      checked={status === "enabled" ? true : false}
      onCheckedChange={() =>
        mutate({ id, status: status === "disabled" ? "enabled" : "disabled" })
      }
    />
  )
}
