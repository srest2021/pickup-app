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
  feedGames: Game[];
  selectedGameId: string | null;
};

type Action = {
  setSession: (session: Session | null) => void;

  setLoading: (loading: boolean) => void;

  setUser: (user: User) => void;
  editUser: (updated: any) => void;

  setUserSports: (userSports: UserSport[]) => void;
  clearUserSports: () => void;

  setMyGames: (myGames: Game[]) => void;
  clearMyGames: () => void;
  addMyGame: (myGame: Game) => void;
  removeMyGame: (myGameId: string) => void;
  editMyGame: (myGameId: string, updated: any) => void;

  setFeedGames: (feedGames: Game[]) => void;
  clearFeedGames: () => void;

  setSelectedGameId: (id: string) => void;
  clearSelectedGameId: () => void;
};

const initialState: State = {
  session: null,
  loading: false,
  user: null,
  userSports: [],
  myGames: [],
  feedGames: [],
  selectedGameId: null,
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
        if (key in updatedUser) {
          updatedUser[key] = updated[key];
        }
      }
      set({ user: updatedUser });
    },

    setUserSports: (userSports) => set({ userSports }),

    clearUserSports: () => set({ userSports: [] }),

    setFeedGames: (feedGames) => set({ feedGames }),

    clearFeedGames: () => set({ feedGames: [] }),

    setMyGames: (myGames) => set({ myGames }),

    clearMyGames: () => set({ myGames: [] }),

    addMyGame: (myGame) => {
      set({ myGames: [myGame, ...get().myGames] });
    },

    removeMyGame: (myGameId) => {
      const newMyGames = get().myGames.filter(
        (myGame) => myGame.id !== myGameId,
      );
      set({ myGames: newMyGames });
    },

    editMyGame: (myGameId, updated) => {
      const newMyGames = get().myGames.map((myGame) => {
        if (myGame.id === myGameId) {
          let updatedGame = { ...updated };
          return updatedGame;
        }
        return myGame;
      });
      set({ myGames: newMyGames });
    },

    setSelectedGameId: (id) => set({ selectedGameId: id }),

    clearSelectedGameId: () => set({ selectedGameId: null }),
  })),
);
