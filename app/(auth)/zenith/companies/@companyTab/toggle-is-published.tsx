import { Switch } from "@/components/ui/switch"
import { api } from "@/convex/_generated/api"
import { TToggleIsPublished } from "@/types/schema/company-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

export function ToggleIsPublished(props: TToggleIsPublished) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.toggleIsPublished),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "The company has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
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
