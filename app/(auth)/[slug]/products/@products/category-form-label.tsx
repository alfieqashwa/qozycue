import { FormLabel } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Coffee, ShoppingBasket, Soup } from "lucide-react"

export const CategoryFormLabel = ({
  categoryName,
}: {
  categoryName: string
}) => {
  const iconBasedOnCategory = (categoryName: string) => {
    switch (categoryName) {
      case "food":
        return <Soup className="text-emerald-200" />
      case "drink":
        return <Coffee className="text-fuchsia-200" />
      case "others":
        return <ShoppingBasket className="text-lime-200" />
      default:
        return null
    }
  }
  return (
    <FormLabel
      className={
        cn(
          {
            "peer-aria-checked:border-emerald-200 peer-aria-checked:ring-emerald-200 hover:border-emerald-200":
              categoryName === "food",
            "peer-aria-checked:border-fuchsia-200 peer-aria-checked:ring-fuchsia-200 hover:border-fuchsia-200":
              categoryName === "drink",
            "peer-aria-checked:border-lime-200 peer-aria-checked:ring-lime-200 hover:border-lime-200":
              categoryName === "others",
          },
          "cursor-pointer rounded-lg border-2 p-2 opacity-50 shadow-md peer-aria-checked:opacity-100 peer-aria-checked:ring-1",
        )
        // "border-border hover:border-primary peer-aria-checked:border-primary peer-aria-checked:ring-ring [&:has([data-state=checked])>div]:border-primary block cursor-pointer rounded-md border-2 p-2 shadow-sm peer-aria-checked:ring-1",
      }
    >
      {iconBasedOnCategory(categoryName)}
    </FormLabel>
  )
}
