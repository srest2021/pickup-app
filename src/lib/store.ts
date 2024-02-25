import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";
import { Game, UserSport, User } from "./types";

type State = {
  session: Session | null;
  loading: boolean;
  user: User | null;
  userSports: UserSport[];
  myGames: Game[];
};

type Action = {
  setSession: (session: Session | null) => void;

  setLoading: (loading: boolean) => void;

  setUser: (user: User) => void;
  editUser: (updated) => void;

  setUserSports: (userSports: UserSport[]) => void;
  clearUserSports: () => void;

  setMyGames: (myGames: Game[]) => void;
  clearMyGames: () => void;
};

const initialState: State = {
  session: null,
  loading: false,
  user: null,
  userSports: [],
  myGames: [],
};

export const useStore = create<State & Action>()(
  immer((set, get) => ({
    ...initialState,

    setSession: (session) => set({ session }),

    setLoading: (loading) => set({ loading }),

    setUser: (user) => set({ user }),

    editUser: (updated) => {
      let updatedUser = { ...get().user };
      for (let key in updated) {
        updatedUser[key] = updated[key];
      }
      set({ user: updatedUser });
    },

    setUserSports: (userSports) => set({ userSports }),
    clearUserSports: () => set({ userSports: [] }),

    setMyGames: (myGames) => set({ myGames }),
    clearMyGames: () => set({ myGames: [] }),
  })),
);
