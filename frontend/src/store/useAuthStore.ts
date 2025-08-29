import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User;
  setAuth: (data: { isLoggedIn: boolean; user: User }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: { name: "", email: "" },
      setAuth: ({ isLoggedIn, user }) =>
        set(() => ({
          isLoggedIn,
          user,
        })),

      clearAuth: () =>
        set(() => ({
          isLoggedIn: false,
          user: { name: "", email: "" },
        })),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
