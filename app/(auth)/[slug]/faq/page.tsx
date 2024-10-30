import { type Metadata } from "next"
import { Lamps } from "./lamps"

export const metadata: Metadata = {
  title: "Documentation",
}

export default function Page() {
  return <Lamps />
}
