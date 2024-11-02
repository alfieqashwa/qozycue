import { Switch } from "@/components/ui/switch"
import { api } from "@/convex/_generated/api"
import { TToggleIsPublished } from "@/types/schema/company-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export function ToggleIsPublished(props: TToggleIsPublished) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.toggleIsPublished),
    onSuccess() {
      toast.success("Succeed!", {
        description: "The company has been updated.",
      })
    },
    onError(err) {
      toast.error("Something went wrong!", {
        description: err.message || "There was a problem with your request.",
      })
    },
  })
  return (
    <span className="whitespace-nowrap capitalize">
      <Switch
        disabled={isPending}
        checked={props.isPublished}
        onCheckedChange={() =>
          mutate({
            toggleIsPublishedSchema: props,
          })
        }
      />
    </span>
  )
}
