import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Session } from "@supabase/supabase-js";
import { UserSport, User, MyGame, JoinedGame, FeedGame } from "./types";
import * as Location from "expo-location";

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

  location: Location.LocationObject | null;

  filterSport: string | null;
  filterDist: number;
  filterLevel: string | null;
};

type Action = {
  setSession: (session: Session | null) => void;

  setLoading: (loading: boolean) => void;

  setUser: (user: User | null) => void;
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

  updateHasRequestedFeedGame: (feedGameId: string) => void;

  // joined games

  setJoinedGames: (feedGames: JoinedGame[]) => void;
  clearJoinedGames: () => void;
  addJoinedGame: (joinedGame: JoinedGame) => void;
  removeJoinedGame: (joinedGameId: string) => void;

  setSelectedJoinedGame: (joinedGame: JoinedGame) => void;
  clearSelectedJoinedGame: () => void;

  //location
  setLocation: (location: Location.LocationObject) => void;
  clearLocation: () => void; //not sure if we'll need this

  //feed filters
  setFilterSport: (sport: string | null) => void;
  setFilterDist: (dist: number) => void;
  setFilterLevel: (level: string | null) => void;

  getFilterSport: () => string | null;
  getFilterDist: () => number;
  getFilterLevel: () => string | null;
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
  location: null,
  filterSport: null,
  filterDist: 15,
  filterLevel: null,
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

    updateHasRequestedFeedGame: (feedGameId: string) => {
      // update Feed Games array
      const updatedMyFeedGames = get().feedGames.map((game) => {
        if (game.id === feedGameId) {
          return {
            ...game,
            hasRequested: !game.hasRequested,
          };
        }
        return game;
      });
      set({ feedGames: updatedMyFeedGames });
      // Navigates back to feed
      set({ selectedFeedGame: null });
    },

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
          updatedGame.joinRequests = myGame.joinRequests;
          updatedGame.acceptedPlayers = myGame.acceptedPlayers;
          return updatedGame;
        }
        return myGame;
      });
      set({ selectedMyGame: updatedGame });
      set({ myGames: updatedMyGames });
    },

    setSelectedMyGame: (myGame) => set({ selectedMyGame: myGame }),

    clearSelectedMyGame: () => set({ selectedMyGame: null }),

    acceptJoinRequest: (gameId, playerId) => {
      // find player object in join requests
      const newPlayer = get()
        .myGames.find((game) => game.id === gameId)
        ?.joinRequests.find((user) => user.id === playerId);

      // update myGames
      const updatedMyGames = get().myGames.map((myGame) => {
        if (myGame.id === gameId) {
          // remove player object from join requests
          myGame.joinRequests = myGame.joinRequests.filter(
            (user) => user.id != playerId,
          );
          // add player object to acceptedPlayers and increment count
          if (newPlayer) {
            myGame.currentPlayers += 1;
            myGame.acceptedPlayers.push(newPlayer);
          }
          set({ selectedMyGame: { ...myGame } });
        }
        return myGame;
      });
      set({ myGames: updatedMyGames });
    },

    rejectJoinRequest: (gameId, playerId) => {
      const updatedMyGames = get().myGames.map((myGame) => {
        if (myGame.id === gameId) {
          // remove player object from join requests
          myGame.joinRequests = myGame.joinRequests.filter(
            (user) => user.id != playerId,
          );
          set({ selectedMyGame: { ...myGame } });
        }
        return myGame;
      });
      set({ myGames: updatedMyGames });
    },

    removePlayer: (gameId, playerId) => {
      const updatedMyGames = get().myGames.map((myGame) => {
        if (myGame.id === gameId) {
          // remove player object from accepted players
          myGame.acceptedPlayers = myGame.acceptedPlayers.filter(
            (user) => user.id != playerId,
          );
          myGame.currentPlayers -= 1;
          set({ selectedMyGame: { ...myGame } });
        }
        return myGame;
      });
      set({ myGames: updatedMyGames });
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

    // location

    setLocation: (location) => set({ location: location }),

    clearLocation: () => set({ location: null }),

    // feed filters

    setFilterSport: (sport) => set({ filterSport: sport }),
    setFilterDist: (dist) => set({ filterDist: dist }),
    setFilterLevel: (level) => set({ filterLevel: level }),

    getFilterSport: () => {
      return get().filterSport;
    },
    getFilterDist: () => {
      return get().filterDist;
    },
    getFilterLevel: () => {
      return get().filterLevel;
    },
  })),
);
