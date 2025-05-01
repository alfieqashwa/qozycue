import { ICountry } from "@/types"
import { type Metadata } from "next"
import { Lamps } from "./lamps"

export const metadata: Metadata = {
  title: "Documentation",
}

export default async function Page() {
  const res = await fetch("https://restcountries.com/v3.1/all")
  const data: ICountry[] = await res.json()

  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Lamps />
    </>
  )
}
