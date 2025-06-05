import { Heart } from "lucide-react"
import packageJson from "../package.json"

export const Copyright = () => (
  <div className="fixed bottom-0 z-50 w-full bg-black pt-1 font-mono">
    <footer className="text-center text-xs leading-tight font-semibold tracking-wider text-zinc-400">
      <p className="whitespace-nowrap">
        <span>© {new Date().getFullYear()} Made with</span>
        <Heart
          className="mx-1 inline-block animate-pulse fill-rose-600 text-rose-500"
          size={16}
        />
        <span>by</span>
        <a
          className="text-foreground ml-1 whitespace-nowrap transition-colors duration-300 ease-in-out hover:text-fuchsia-400"
          href="https://github.com/alfieqashwa"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alfie Qashwa
        </a>
      </p>
      <p className="text-center text-xs font-semibold tracking-wider">
        Version: {packageJson.version}
      </p>
    </footer>
  </div>
)
