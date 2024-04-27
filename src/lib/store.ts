import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RealtimeChannel, Session } from "@supabase/supabase-js";
import {
  UserSport,
  User,
  MyGame,
  JoinedGame,
  FeedGame,
  Message,
  OtherUser,
  ThumbnailUser,
} from "./types";
import * as Location from "expo-location";
import { Q } from "@upstash/redis/zmscore-07021e27";

type State = {
  session: Session | null;
  loading: boolean;

  user: User | null;
  userSports: UserSport[];

  otherUser: OtherUser | null;

  myGames: MyGame[];
  selectedMyGame: MyGame | null;

  joinedGames: JoinedGame[];
  selectedJoinedGame: JoinedGame | null;

  feedGames: FeedGame[];
  feedGamesFriendsOnly: FeedGame[];
  selectedFeedGame: FeedGame | null;

  location: Location.LocationObject | null;

  filterSport: string | null;
  filterDist: number;
  filterLevel: string | null;

  friends: ThumbnailUser[];
  friendRequests: ThumbnailUser[];
  searchResults: ThumbnailUser[] | null;

  channel: RealtimeChannel | undefined;
  roomCode: string | null;
  messages: Message[];
  avatarUrls: any[];
};

type Action = {
  setSession: (session: Session | null) => void;

  setLoading: (loading: boolean) => void;

  // user
  setUser: (user: User | null) => void;
  editUser: (updated: any) => void;
  addUserSport: (userSport: UserSport) => void;
  editUserSport: (userSport: UserSport) => void;
  setUserSports: (userSports: UserSport[]) => void;
  clearUserSports: () => void;

  // other user
  setOtherUser: (otherUser: OtherUser | null) => void;

  // my games
  setMyGames: (myGames: MyGame[]) => void;
  clearMyGames: () => void;
  addMyGame: (myGame: MyGame) => void;
  removeMyGame: (myGameId: string) => void;
  editMyGame: (myGameId: string, updated: any) => void;

  // game players
  acceptJoinRequest: (
    gameId: string,
    playerId: string,
    plusOne: boolean,
  ) => void;
  rejectJoinRequest: (gameId: string, playerId: string) => void;
  removePlayer: (gameId: string, playerId: string, plusOne: boolean) => void;

  // selected my game
  setSelectedMyGame: (myGame: MyGame) => void;
  updateMyGame: (gameId: string, update: any) => void;
  clearSelectedMyGame: () => void;

  // feed games
  setFeedGames: (feedGames: FeedGame[]) => void;
  clearFeedGames: () => void;
  setFeedGamesFriendsOnly: (feedGames: FeedGame[]) => void;
  clearFeedGamesFriendsOnly: () => void;

  // selected feed game
  setSelectedFeedGame: (feedGame: FeedGame) => void;
  clearSelectedFeedGame: () => void;
  updateHasRequestedFeedGame: (feedGameId: string) => void;
  updateFeedGame: (gameId: string, update: any) => void;

  // joined games
  setJoinedGames: (feedGames: JoinedGame[]) => void;
  clearJoinedGames: () => void;
  addJoinedGame: (joinedGame: JoinedGame) => void;
  removeJoinedGame: (joinedGameId: string) => void;

  // selected joined game
  setSelectedJoinedGame: (joinedGame: JoinedGame) => void;
  clearSelectedJoinedGame: () => void;
  updateJoinedGame: (gameId: string, update: any) => void;

  // location
  setLocation: (location: Location.LocationObject) => void;
  clearLocation: () => void;

  // feed filters
  setFilterSport: (sport: string | null) => void;
  setFilterDist: (dist: number) => void;
  setFilterLevel: (level: string | null) => void;
  getFilterSport: () => string | null;
  getFilterDist: () => number;
  getFilterLevel: () => string | null;

  // chatroom
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  addMessage: (message: Message) => void;
  addMessages: (messages: Message[]) => void;
  setChannel: (channel: RealtimeChannel | undefined) => void;
  setRoomCode: (roomCode: string) => void;

  // avatar urls
  editAvatarPath: (userId: string, avatarPath: string | null) => void;
  addAvatarUrls: (newAvatarUrls: any[]) => void;
  addAvatarUrl: (userId: string, avatarUrl: string | null) => void;
  clearAvatarUrls: () => void;

  // friends
  setFriends: (friends: ThumbnailUser[]) => void;
  setFriendRequests: (friendRequests: ThumbnailUser[]) => void;
  addFriendRequest: () => void;
  acceptFriendRequest: (userId: string) => void;
  rejectFriendRequest: (userId: string) => void;
  removeFriend: (userId: string) => void;

  // search results
  setSearchResults: (results: ThumbnailUser[] | null) => void;
};

const initialState: State = {
  session: null,
  loading: false,
  user: null,
  userSports: [],
  otherUser: null,
  myGames: [],
  selectedMyGame: null,
  feedGames: [],
  feedGamesFriendsOnly: [],
  selectedFeedGame: null,
  joinedGames: [],
  selectedJoinedGame: null,
  location: null,
  filterSport: null,
  filterDist: 15,
  filterLevel: null,
  messages: [],
  channel: undefined,
  roomCode: null,
  avatarUrls: [],
  friends: [],
  friendRequests: [],
  searchResults: null,
};

export const useStore = create<State & Action>()(
  immer((set, get) => ({
    ...initialState,

    setSession: (session) => set({ session }),

    setLoading: (loading) => set({ loading }),

    setUser: (user) => set({ user }),

    setOtherUser: (user) => set({ otherUser: user }),

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

    setFeedGames: (newGames) =>
      set((state) => ({ feedGames: [...state.feedGames, ...newGames] })),

    clearFeedGames: () => set({ feedGames: [] }),

    setFeedGamesFriendsOnly: (newGames) =>
      set((state) => ({
        feedGamesFriendsOnly: [...state.feedGamesFriendsOnly, ...newGames],
      })),

    clearFeedGamesFriendsOnly: () => set({ feedGamesFriendsOnly: [] }),

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

    updateFeedGame: (gameId, update) => {
      const feedGame = get().selectedFeedGame;
      if (feedGame && feedGame.id === gameId) {
        const updatedFeedGame = { ...feedGame, ...update };
        set({ selectedFeedGame: updatedFeedGame });

        const updatedFeedGames = get().feedGames.map((game) => {
          if (game.id === gameId) {
            return updatedFeedGame;
          }
          return game;
        });
        set({ feedGames: updatedFeedGames });
      }
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

    updateMyGame: (gameId, update) => {
      const myGame = get().selectedMyGame;
      if (myGame && myGame.id === gameId) {
        const updatedMyGame = { ...myGame, ...update };
        set({ selectedMyGame: updatedMyGame });

        const updatedMyGames = get().myGames.map((game) => {
          if (game.id === gameId) {
            return updatedMyGame;
          }
          return game;
        });
        set({ myGames: updatedMyGames });
      }
    },

    acceptJoinRequest: (gameId, playerId, plusOne) => {
      // find player object in join requests
      const newPlayer = get()
        .myGames.find((game) => game.id === gameId)
        ?.joinRequests?.find((user) => user.id === playerId);
      // do nothing if new player can't be found (shouldn't ever happen)
      if (!newPlayer) return;

      // update myGames
      const updatedMyGames = get().myGames.map((myGame) => {
        if (
          myGame.id === gameId &&
          myGame.joinRequests &&
          myGame.acceptedPlayers
        ) {
          // remove player object from join requests
          myGame.joinRequests = myGame.joinRequests.filter(
            (user) => user.id !== playerId,
          );
          // add player object to acceptedPlayers and increment count
          if (newPlayer) {
            plusOne
              ? (myGame.currentPlayers += 2)
              : (myGame.currentPlayers += 1);
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
        if (myGame.id === gameId && myGame.joinRequests) {
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

    removePlayer: (gameId, playerId, plusOne) => {
      const updatedMyGames = get().myGames.map((myGame) => {
        if (myGame.id === gameId && myGame.acceptedPlayers) {
          // remove player object from accepted players
          myGame.acceptedPlayers = myGame.acceptedPlayers.filter(
            (user) => user.id != playerId,
          );
          plusOne ? (myGame.currentPlayers -= 2) : (myGame.currentPlayers -= 1);
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

    updateJoinedGame: (gameId, update) => {
      const joinedGame = get().selectedJoinedGame;
      if (joinedGame && joinedGame.id === gameId) {
        const updatedJoinedGame = { ...joinedGame, ...update };
        set({ selectedJoinedGame: updatedJoinedGame });

        const updatedJoinedGames = get().joinedGames.map((game) => {
          if (game.id === gameId) {
            return updatedJoinedGame;
          }
          return game;
        });
        set({ joinedGames: updatedJoinedGames });
      }
    },

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

    // chatroom

    setMessages: (messages) => set({ messages }),

    clearMessages: () => set({ messages: [] }),

    addMessage: (message) => set({ messages: [...get().messages, message] }),

    addMessages: (messages) =>
      set({ messages: [...get().messages, ...messages] }),

    setChannel: (channel) => set({ channel }),

    setRoomCode: (roomCode) => set({ roomCode }),

    editAvatarPath: (userId, avatarPath) => {
      const newAvatarUrls = get().avatarUrls.map((elem) => {
        if (elem.userId === userId) {
          // replace avatar path and clear downloaded url
          elem.avatarPath = avatarPath;
          elem.avatarUrl = null;
        }
        return elem;
      });
      set({ avatarUrls: newAvatarUrls });
    },

    addAvatarUrls: (newAvatarUrls) => {
      // filter out avatar urls that already exist in store
      const filteredAvatarUrls = newAvatarUrls.filter(
        (updated) =>
          !get().avatarUrls.some((old) => old.userId === updated.userId),
      );
      // add new avatar urls
      set({ avatarUrls: [...get().avatarUrls, ...filteredAvatarUrls] });
    },

    addAvatarUrl: (userId, avatarUrl) => {
      const newAvatarUrls = get().avatarUrls.map((elem) => {
        if (elem.userId === userId) {
          elem.avatarUrl = avatarUrl;
        }
        return elem;
      });
      set({ avatarUrls: newAvatarUrls });
    },

    clearAvatarUrls: () => set({ avatarUrls: [] }),

    // friends

    setFriends: (myfriends) => set({ friends: myfriends }),
    setFriendRequests: (myFriendRequests) =>
      set({ friendRequests: myFriendRequests }),

    addFriendRequest: () => {
      get().otherUser!.hasRequested = true;
    },

    acceptFriendRequest: (userId) => {
      // Save the newly accepted friend only!
      const acceptedFriend = get().friendRequests.filter(
        (friendRequest) => friendRequest.id == userId,
      );

      // Remove the accepted friend from the friend requests lists
      const updatedFriendRequests = get().friendRequests.filter(
        (friendRequest) => friendRequest.id != userId,
      );

      // update requests list
      set({ friendRequests: updatedFriendRequests });

      // add newly accepted friend to friends list
      set({ friends: [acceptedFriend[0], ...get().friends] });
    },

    rejectFriendRequest: (userId) => {
      const updatedFriendRequests = get().friendRequests.filter(
        (friendRequest) => friendRequest.id != userId,
      );
      // update requests list
      set({ friendRequests: updatedFriendRequests });
    },

    removeFriend: (userId) => {
      const updatedFriends = get().friends.filter(
        (friend) => friend.id != userId,
      );

      //update friends list
      set({ friends: updatedFriends });
    },

    setSearchResults: (results) => set({ searchResults: results }),
  })),
);
