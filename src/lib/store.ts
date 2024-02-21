import {create} from "zustand";
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";
import { Sport } from "./types";

type State = {
  session: Session | null;

  sports: Sport[];

  username: string | null;
  displayName: string  | null;
  bio: string | null;
  avatarUrl: string | null;
}

type Action = {
  setSession: (session: Session) => void;
  
  setUsername: (username: string) => void;
  clearUsername: () => void;

  setDisplayName: (displayName: string) => void;
  clearDisplayName: () => void;

  setBio: (bio: string) => void;
  clearBio: () => void;

  setAvatarUrl: (avatarUrl: string) => void;
  clearAvatarUrl: () => void;

  setSports: (sports: Sport[]) => void;  
  clearSports: () => void;
}

const initialState: State = {
  session: null,
  sports: [],

  username: null,
  displayName: null,
  bio: null,
  avatarUrl: null
};

export const useStore = create<State & Action>()(
  immer((set, get) => ({
    ...initialState,

    setSession: (session) => set({ session }),

    setUsername: (username) => set({ username }),
    clearUsername: () => set({ username: null }),

    setDisplayName: (displayName) => set({ displayName }),
    clearDisplayName: () => set({ displayName: null }),

    setBio: (bio) => set({ bio }),
    clearBio: () => set({ bio: null }),

    setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
    clearAvatarUrl: () => set({ avatarUrl: null }),

    setSports: (sports) => set({ sports }),
    clearSports: () => set({ sports: [] }),
  })),
);

