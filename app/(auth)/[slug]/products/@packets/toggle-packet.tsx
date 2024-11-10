//? Packet
export function TogglePacket({
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
    onSuccess() {
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
    },
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
      onCheckedChange={() => mutate({ id, status })}
    />
  )
}
