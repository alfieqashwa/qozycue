import { Wifi, WifiOff } from "lucide-react"
import { useOnlineStatus } from "@/app/hooks/use-online-status"

export function ConnectionStatus() {
  const isOnline = useOnlineStatus()
  return (
    <div>
      {isOnline ? (
        <Wifi className="text-primary" />
      ) : (
        <WifiOff className="text-muted-foreground" />
      )}
    </div>
  )
}
