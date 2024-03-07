import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";
import { UserSport, User, GameWithAddress, GameWithoutAddress } from "./types";

type State = {
  session: Session | null;
  loading: boolean;

  user: User | null;
  userSports: UserSport[];

  myGames: GameWithAddress[];
  selectedMyGame: GameWithAddress | null;

  joinedGames: GameWithAddress[];
  selectedJoinedGame: GameWithAddress | null;

  feedGames: GameWithoutAddress[];
  selectedFeedGame: GameWithoutAddress | null;
};

type Action = {
  setSession: (session: Session | null) => void;

  setLoading: (loading: boolean) => void;

  setUser: (user: User) => void;
  editUser: (updated: any) => void;

  addUserSport: (userSport: UserSport) => void;
  editUserSport: (userSport: UserSport) => void;
  setUserSports: (userSports: UserSport[]) => void;
  clearUserSports: () => void;

  // my games

  setMyGames: (myGames: GameWithAddress[]) => void;
  clearMyGames: () => void;
  addMyGame: (myGame: GameWithAddress) => void;
  removeMyGame: (myGameId: string) => void;
  editMyGame: (myGameId: string, updated: any) => void;

  setSelectedMyGame: (myGame: GameWithAddress) => void;
  clearSelectedMyGame: () => void;

  // feed games

  setFeedGames: (feedGames: GameWithoutAddress[]) => void;
  clearFeedGames: () => void;

  setSelectedFeedGame: (feedGame: GameWithoutAddress) => void;
  clearSelectedFeedGame: () => void;

  // joined games

  setJoinedGames: (feedGames: GameWithAddress[]) => void;
  clearJoinedGames: () => void;
  addJoinedGame: (joinedGame: GameWithAddress) => void;
  removeJoinedGame: (joinedGameId: string) => void;

  setSelectedJoinedGame: (joinedGame: GameWithAddress) => void;
  clearSelectedJoinedGame: () => void;
};

const initialState: State = {
  session: null,
  loading: false,
  user: null,
  userSports: [],
  myGames: [],
  selectedMyGame: null,
  feedGames: [],
  selectedFeedGame: null,
  joinedGames: [],
  selectedJoinedGame: null,
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

    addUserSport: (newUserSport) =>
      set({ userSports: [newUserSport, ...get().userSports] }),

    editUserSport: (newUserSport) => {
      const newUserSports = get().userSports.map((userSport) => {
        if (userSport.id === newUserSport.id) {
          return newUserSport;
        }
        return userSport;
      });
      set({ userSports: newUserSports });
    },

    clearUserSports: () => set({ userSports: [] }),

    // feed games

    setFeedGames: (feedGames) => set({ feedGames }),

    clearFeedGames: () => set({ feedGames: [] }),

    setSelectedFeedGame: (feedGame) => set({ selectedFeedGame: feedGame }),

    clearSelectedFeedGame: () => set({ selectedFeedGame: null }),

    // my games

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
      set({ selectedMyGame: null });
    },

    editMyGame: (myGameId, updatedGame) => {
      const newMyGames = get().myGames.map((myGame) => {
        if (myGame.id === myGameId) {
          return updatedGame;
        }
        return myGame;
      });
      set({ myGames: newMyGames });
    },

    setSelectedMyGame: (myGame) => set({ selectedMyGame: myGame }),

    clearSelectedMyGame: () => set({ selectedMyGame: null }),

    // joined games

    setJoinedGames: (joinedGames) => set({ joinedGames }),

    clearJoinedGames: () => set({ joinedGames: [] }),

    addJoinedGame: (joinedGame) => {
      set({ joinedGames: [joinedGame, ...get().joinedGames] });
    },

    removeJoinedGame: (joinedGameId) => {
      const newJoinedGames = get().joinedGames.filter(
        (joinedGame) => joinedGame.id !== joinedGameId,
      );
      set({ joinedGames: newJoinedGames });
      set({ selectedJoinedGame: null });
    },

    setSelectedJoinedGame: (joinedGame) =>
      set({ selectedJoinedGame: joinedGame }),

    clearSelectedJoinedGame: () => set({ selectedJoinedGame: null }),
  })),
);
