import { Heart } from "lucide-react"
import packageJson from "../package.json"

export const Copyright = () => (
  <div className="absolute bottom-0 w-full">
    <footer className="flex h-8 items-center justify-center bg-gradient-to-t from-white to-foreground bg-clip-text text-xs font-medium tracking-widest text-transparent text-zinc-400">
      <p className="whitespace-nowrap">
        © {new Date().getFullYear()} Made with{" "}
      </p>
      <Heart
        className="mx-1.5 animate-pulse fill-rose-600 text-rose-600"
        size={16}
      />
      <span>by</span>
      <a
        className="ml-1.5 whitespace-nowrap text-foreground transition-colors duration-300 ease-in-out hover:text-cyan-400"
        href="https://github.com/alfieqashwa"
        target="_blank"
        rel="noopener noreferrer"
      >
        Alfie Qashwa
      </a>
    </footer>
    <p className="pb-2 text-center text-xs font-semibold tracking-widest">
      Version: {packageJson.version}
    </p>
  </div>
)
