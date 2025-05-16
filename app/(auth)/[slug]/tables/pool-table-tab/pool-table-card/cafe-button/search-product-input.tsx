import { useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"

export function SearchProductInput({
  placeholder,
  searchTerm,
  setSearchTerm,
}: {
  placeholder: string
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}) {
  const debounceSearch = useDebouncedCallback((term: string) => {
    // console.log(`Searching... ${term}`)

    setSearchTerm(term.toLowerCase())
  }, 300)

  /*
  ChatGPT:
  https://chatgpt.com/c/6d6ca714-c9fa-493a-9b2a-74b697931cff
  */
  useEffect(() => {
    // This effect will trigger whenever searchTerm changes
    debounceSearch(searchTerm)
  }, [searchTerm, debounceSearch])

  return (
    <Input
      placeholder={placeholder}
      className="max-w-[480px] text-sm"
      value={searchTerm}
      // onChange={(e) => debounceSearch(e.target.value)}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
