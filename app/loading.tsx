import { GiPoolTriangle } from "react-icons/gi"

export default function LoadingTriangle() {
  return (
    <div className="grid min-h-screen w-full place-items-center">
      <GiPoolTriangle
        //   color="rgb(148 163 184)"
        className="text-primary size-14 animate-ping md:size-16"
      />
    </div>
  )
}
