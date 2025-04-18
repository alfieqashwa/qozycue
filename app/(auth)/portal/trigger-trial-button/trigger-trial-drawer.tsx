import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export default function TriggerTrialDrawer({
  open,
  setOpen,
  title,
  description,
  triggerButton,
  children,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  description: string
  triggerButton: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton} </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
