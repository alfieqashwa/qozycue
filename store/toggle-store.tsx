import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type ToggleStore = {
  toggle: boolean
  onToggle: () => void
}

export const useToggleStore = create<ToggleStore>()(
  devtools(
    persist(
      (set, get) => ({
        toggle: false,
        onToggle: () => set({ toggle: (get().toggle = !get().toggle) }),
      }),
      {
        name: "toggle-storage",
        skipHydration: true,
      },
    ),
  ),
)
