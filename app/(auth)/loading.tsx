import { GiPoolTriangle } from "react-icons/gi"

export default function Loading() {
  return (
    <div className="grid min-h-screen w-full place-items-center">
      <GiPoolTriangle
        //   color="rgb(148 163 184)"
        className="size-14 animate-ping text-primary md:size-16"
      />
    </div>
  )
}
