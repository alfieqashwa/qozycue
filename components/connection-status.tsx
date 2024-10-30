import { Wifi, WifiOff } from "lucide-react"
import { useOnlineStatus } from "@/app/hooks/use-online-status"

export function ConnectionStatus() {
  const isOnline = useOnlineStatus()
  return (
    <div>
      {isOnline ? (
        <Wifi size={20} className="text-primary" />
      ) : (
        <WifiOff size={20} className="text-muted-foreground" />
      )}
    </div>
  )
}
