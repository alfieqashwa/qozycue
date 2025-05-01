import { type Metadata } from "next"
import { Lamps } from "./lamps"

export const metadata: Metadata = {
  title: "Documentation",
}

export default async function Page() {
  return <Lamps />
}
