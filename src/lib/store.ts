import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";
import { Game, UserSport, User } from "./types";

type State = {
  session: Session | null;
  loading: boolean;
  updateGameStatus: boolean;
  user: User | null;
  userSports: UserSport[];
  myGames: Game[];
  selectedGameId: string | null;
};

type Action = {
  setSession: (session: Session | null) => void;

  setLoading: (loading: boolean) => void;
  setUpdateGameStatus: (loading: boolean) => void;

  setUser: (user: User) => void;
  editUser: (updated: any) => void;

  setUserSports: (userSports: UserSport[]) => void;
  clearUserSports: () => void;

  setMyGames: (myGames: Game[]) => void;
  clearMyGames: () => void;
  addMyGame: (myGame: Game) => void;
  removeMyGame: (myGameId: string) => void;
  editMyGame: (myGameId: string, updated: any) => void;

  setSelectedGameId: (id: string) => void;
  clearSelectedGameId: () => void;
};

const initialState: State = {
  session: null,
  loading: false,
  user: null,
  userSports: [],
  myGames: [],
  selectedGameId: null,
  updateGameStatus: false,
};

export const useStore = create<State & Action>()(
  immer((set, get) => ({
    ...initialState,

    setSession: (session) => set({ session }),

    setLoading: (loading) => set({ loading }),

    setUpdateGameStatus: (updateGameStatus) => set({ updateGameStatus }),

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
          let updatedGame = { ...myGame };
          for (let key in updated) {
            if (key in updatedGame) {
              updatedGame[key] = updated[key];
            }
          }
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
