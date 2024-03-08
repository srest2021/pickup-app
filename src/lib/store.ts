import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";
import { UserSport, User, MyGame, JoinedGame, FeedGame } from "./types";

type State = {
  session: Session | null;
  loading: boolean;

  user: User | null;
  userSports: UserSport[];

  myGames: MyGame[];
  selectedMyGame: MyGame | null;

  joinedGames: JoinedGame[];
  selectedJoinedGame: JoinedGame | null;

  feedGames: FeedGame[];
  selectedFeedGame: FeedGame | null;
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

  setMyGames: (myGames: MyGame[]) => void;
  clearMyGames: () => void;
  addMyGame: (myGame: MyGame) => void;
  removeMyGame: (myGameId: string) => void;
  editMyGame: (myGameId: string, updated: any) => void;

  acceptJoinRequest: (gameId: string, playerId: string) => void;
  rejectJoinRequest: (gameId: string, playerId: string) => void;
  removePlayer: (gameId: string, playerId: string) => void;

  setSelectedMyGame: (myGame: MyGame) => void;
  clearSelectedMyGame: () => void;

  // feed games

  setFeedGames: (feedGames: FeedGame[]) => void;
  clearFeedGames: () => void;

  setSelectedFeedGame: (feedGame: FeedGame) => void;
  clearSelectedFeedGame: () => void;

  // joined games

  setJoinedGames: (feedGames: JoinedGame[]) => void;
  clearJoinedGames: () => void;
  addJoinedGame: (joinedGame: JoinedGame) => void;
  removeJoinedGame: (joinedGameId: string) => void;

  setSelectedJoinedGame: (joinedGame: JoinedGame) => void;
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
      set({ selectedMyGame: myGame });
    },

    removeMyGame: (myGameId) => {
      const updatedMyGames = get().myGames.filter(
        (myGame) => myGame.id !== myGameId,
      );
      set({ myGames: updatedMyGames });
      set({ selectedMyGame: null });
    },

    editMyGame: (myGameId, updatedGame) => {
      const updatedMyGames = get().myGames.map((myGame) => {
        if (myGame.id === myGameId) {
          return { 
            ...updatedGame, 
            joinRequests: myGame.joinRequests, 
            acceptedPlayers: myGame.acceptedPlayers
          };
        }
        return myGame;
      });
      set({ selectedMyGame: updatedGame });
      set({ myGames: updatedMyGames });
    },

    setSelectedMyGame: (myGame) => set({ selectedMyGame: myGame }),

    clearSelectedMyGame: () => set({ selectedMyGame: null }),

    acceptJoinRequest: (gameId, playerId) => {
      const newPlayer = get()
        .myGames.find((game) => game.id === gameId)
        ?.joinRequests.find((user) => user.id === playerId);

      const updatedMyGames = get().myGames.map((myGame) => {
        if (myGame.id === gameId) {
          myGame.joinRequests = myGame.joinRequests.filter(
            (user) => user.id != playerId,
          );
          if (newPlayer) myGame.acceptedPlayers.push(newPlayer);
        }
        return myGame;
      });
      set({ myGames: updatedMyGames });

      let updatedGame = get().selectedMyGame;
      if (updatedGame && updatedGame.id === gameId) {
        updatedGame.joinRequests = updatedGame.joinRequests.filter(
          (user) => user.id != playerId,
        );
        if (newPlayer) updatedGame.acceptedPlayers.push(newPlayer);
        set({ selectedMyGame: updatedGame });
      }
    },

    rejectJoinRequest: (gameId, playerId) => {
      const updatedMyGames = get().myGames.map((myGame) => {
        if (myGame.id === gameId) {
          myGame.joinRequests = myGame.joinRequests.filter(
            (user) => user.id != playerId,
          );
        }
        return myGame;
      });
      set({ myGames: updatedMyGames });

      let updatedGame = get().selectedMyGame;
      if (updatedGame && updatedGame.id === gameId) {
        updatedGame.joinRequests = updatedGame.joinRequests.filter(
          (user) => user.id != playerId,
        );
        set({ selectedMyGame: updatedGame });
      }
    },

    removePlayer: (gameId, playerId) => {
      const updatedMyGames = get().myGames.map((myGame) => {
        if (myGame.id === gameId) {
          myGame.acceptedPlayers = myGame.joinRequests.filter(
            (user) => user.id != playerId,
          );
        }
        return myGame;
      });
      set({ myGames: updatedMyGames });

      let updatedGame = get().selectedMyGame;
      if (updatedGame && updatedGame.id === gameId) {
        updatedGame.acceptedPlayers = updatedGame.joinRequests.filter(
          (user) => user.id != playerId,
        );
        set({ selectedMyGame: updatedGame });
      }
    },

    // joined games

    setJoinedGames: (joinedGames) => set({ joinedGames }),

    clearJoinedGames: () => set({ joinedGames: [] }),

    addJoinedGame: (joinedGame) => {
      set({ joinedGames: [joinedGame, ...get().joinedGames] });
      set({ selectedJoinedGame: joinedGame });
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
