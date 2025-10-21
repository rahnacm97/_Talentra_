import { create } from "zustand";
import type { NavigateFunction } from "react-router-dom";

interface NavigationStore {
  navigate: NavigateFunction | null;
  setNavigate: (navigateFn: NavigateFunction) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  navigate: null,
  setNavigate: (navigateFn) => set({ navigate: navigateFn }),
}));