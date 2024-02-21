import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";
import { Sport, User } from "./types";

type State = {
  session: Session | null;
  loading: boolean;
  user: User | null;
  sports: Sport[];

  // username: string | null;
  // displayName: string | null;
  // bio: string | null;
  // avatarUrl: string | null;
};

type Action = {
  setSession: (session: Session | null) => void;

  setLoading: (loading: boolean) => void;

  setUser: (user: User) => void;
  editUser: (updatedUser) => void;

  setSports: (sports: Sport[]) => void;
  clearSports: () => void;
};

const initialState: State = {
  session: null,
  loading: false,
  user: null,
  sports: [],
};

export const useStore = create<State & Action>()(
  immer((set, get) => ({
    ...initialState,

    setSession: (session) => set({ session }),

    setLoading: (loading) => set({ loading }),

    setUser: (user) => set({ user }),

    editUser: (updatedUser) => {
      let newUser = { ...get().user };
      for (let key in updatedUser) {
        newUser[key] = updatedUser[key];
      }
      set({ user: newUser });
    },

    setSports: (sports) => set({ sports }),
    clearSports: () => set({ sports: [] }),
  })),
);
