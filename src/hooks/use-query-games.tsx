import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Address, GameSport, MyGame, JoinedGame, FeedGame } from "../lib/types";
import useQueryUsers from "./use-query-users";

function useQueryGames() {
  const [
    session,
    setLoading,
    myGames,
    setMyGames,
    clearMyGames,
    setFeedGames,
    clearFeedGames,
    setFeedGamesFriendsOnly,
    clearFeedGamesFriendsOnly,
    setJoinedGames,
    clearJoinedGames,
    location,
    getFilterSport,
    getFilterDist,
    getFilterLevel,
    updateSelectedMyGame,
    updateSelectedJoinedGame,
    updateSelectedFeedGame,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.myGames,
    state.setMyGames,
    state.clearMyGames,
    state.setFeedGames,
    state.clearFeedGames,
    state.setFeedGamesFriendsOnly,
    state.clearFeedGamesFriendsOnly,
    state.setJoinedGames,
    state.clearJoinedGames,
    state.location,
    state.getFilterSport,
    state.getFilterDist,
    state.getFilterLevel,
    state.updateSelectedMyGame,
    state.updateSelectedJoinedGame,
    state.updateSelectedFeedGame,
  ]);

  const { getUserLocation } = useQueryUsers();

  const fetchMyGames = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view games");

      //if no location, for now, default location is charmander marmander
      const lat = location ? location.coords.latitude : 39.3289357;
      const long = location ? location.coords.longitude : -76.6172978;

      const { data, error } = await supabase.rpc("get_my_games", {
        lat: lat,
        long: long,
      });
      if (error) throw error;

      if (data) {
        const games = data.map((game: any) => {
          const myGame: MyGame = {
            id: game.id,
            organizerId: game.organizer_id,
            title: game.title,
            description: game.description,
            datetime: game.datetime,
            sport: {
              name: game.sport,
              skillLevel: game.skill_level,
            } as GameSport,
            maxPlayers: Number(game.max_players),
            currentPlayers: Number(game.current_players),
            isPublic: game.is_public,
            distanceAway: location
              ? Math.trunc(game.dist_meters) !== 0
                ? Math.trunc(game.dist_meters)
                : Math.round(game.dist_meters * 10) / 10
              : "?",
            address: null,
            joinRequests: null,
            acceptedPlayers: null,
          };
          return myGame;
        });
        setMyGames(games);
      } else {
        throw new Error("Error fetching my games! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching my games! Please try again later.");
      }
      clearMyGames();
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedGames = async () => {
    try {
      setLoading(true);
      if (!session?.user)
        throw new Error("Please sign in to view joined games");

      //if no location, for now, default location is charmander marmander
      const lat = location ? location.coords.latitude : 39.3289357;
      const long = location ? location.coords.longitude : -76.6172978;

      const { data, error } = await supabase.rpc("get_joined_games", {
        lat: lat,
        long: long,
      });

      if (error) throw error;

      if (data) {
        const games = data.map((game: any) => {
          const joinedGame: JoinedGame = {
            id: game.id,
            organizerId: game.organizer_id,
            title: game.title,
            description: game.description,
            datetime: game.datetime,
            sport: {
              name: game.sport,
              skillLevel: game.skill_level,
            } as GameSport,
            maxPlayers: Number(game.max_players),
            currentPlayers: Number(game.current_players),
            isPublic: Boolean(game.is_public),
            distanceAway: location
              ? Math.trunc(game.dist_meters) !== 0
                ? Math.trunc(game.dist_meters)
                : Math.round(game.dist_meters * 10) / 10
              : "?",
            address: null,
            acceptedPlayers: null,
            organizer: game.organizer,
          };
          return joinedGame;
        });
        setJoinedGames(games);
      } else {
        throw new Error("Error fetching joined games! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching joined games! Please try again later.");
      }
      clearJoinedGames();
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedGames = async (friendsOnly: Boolean, offset: number) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view feed games");

      const { location, error1 } = await getUserLocation();
      if (!location || error1) throw error1;

      //backend: use these parameters in nearby_games!
      const filterSport = getFilterSport();
      const filterDist = getFilterDist();
      const filterLevel = getFilterLevel();

      const { data, error } = await supabase.rpc(
        friendsOnly ? "get_friends_only_games" : "get_public_games",
        {
          lat: location.coords.latitude,
          long: location.coords.longitude,
          dist_limit: filterDist,
          sport_filter: filterSport,
          skill_level_filter: filterLevel,
          offset,
          limit: 20,
        },
      );
      if (error) throw error;

      if (data) {
        const games = data.map((game: any) => {
          const feedGame: FeedGame = {
            id: game.id,
            organizerId: game.organizer_id,
            title: game.title,
            description: game.description,
            datetime: game.datetime,
            sport: {
              name: game.sport,
              skillLevel: game.skill_level,
            } as GameSport,
            maxPlayers: Number(game.max_players),
            currentPlayers: Number(game.current_players),
            isPublic: Boolean(game.is_public),
            distanceAway:
              Math.trunc(game.dist_meters) !== 0
                ? Math.trunc(game.dist_meters)
                : Math.round(game.dist_meters * 10) / 10,
            hasRequested: null,
            acceptedPlayers: null,
            organizer: game.organizer,
          };
          return feedGame;
        });
        offset === 0 &&
          (friendsOnly ? clearFeedGamesFriendsOnly() : clearFeedGames());
        friendsOnly ? setFeedGamesFriendsOnly(games) : setFeedGames(games);
        return games;
      } else {
        throw new Error("Error fetching feed games! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching feed games! Please try again later.");
      }
      friendsOnly ? clearFeedGamesFriendsOnly() : clearFeedGames();
    } finally {
      setLoading(false);
    }
  };

  const fetchGameAddress = async (gameId: string, gameType: string) => {
    try {
      setLoading(true);
      if (!session?.user)
        throw new Error("Please sign in to view game address!");

      const { data, error } = await supabase
        .from("game_locations")
        .select("*")
        .eq("game_id", gameId)
        .single();
      console.log("address: ", data, error);
      if (error) throw error;

      if (data) {
        const address: Address = {
          street: data.street,
          city: data.city,
          state: data.state,
          zip: data.zip,
        };
        if (gameType === "my") {
          updateSelectedMyGame(gameId, { address });
        } else if (gameType === "joined") {
          updateSelectedJoinedGame(gameId, { address });
        }
      } else {
        throw new Error("Error fetching feed games! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching address! Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchGameAcceptedPlayers = async (gameId: string, gameType: string) => {
    try {
      if (!session?.user)
        throw new Error("Please sign in to view accepted players!");

      let { data, error } = await supabase.rpc("get_accepted_players", {
        game_id_param: gameId,
      });
      console.log("accepted players: ", data, error);
      if (error) throw error;
      if (data == null) data = [];

      if (gameType === "my") {
        updateSelectedMyGame(gameId, { acceptedPlayers: data });
      } else if (gameType === "joined") {
        updateSelectedJoinedGame(gameId, { acceptedPlayers: data });
      } else if (gameType === "feed") {
        updateSelectedFeedGame(gameId, { acceptedPlayers: data });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching accepted players! Please try again later.");
      }
    }
  };

  const fetchGameJoinRequests = async (gameId: string) => {
    try {
      if (!session?.user)
        throw new Error("Please sign in to view join requests!");

      let { data, error } = await supabase.rpc("get_join_requests", {
        game_id_param: gameId,
      });
      console.log("join requests: ", data, error);
      if (error) throw error;
      if (data == null) data = [];
      updateSelectedMyGame(gameId, { joinRequests: data });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching join requests! Please try again later.");
      }
    }
  };

  const fetchGameHasRequested = async (gameId: string) => {
    try {
      if (!session?.user) throw new Error("Please sign in to request to join!");

      const { data, error } = await supabase.rpc("get_has_requested", {
        game_id_param: gameId,
      });
      console.log("has requested: ", data, error);
      if (error) throw error;
      updateSelectedFeedGame(gameId, { hasRequested: data });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching game info! Please try again later.");
      }
    }
  };

  return {
    fetchMyGames,
    fetchJoinedGames,
    fetchFeedGames,
    fetchGameAddress,
    fetchGameAcceptedPlayers,
    fetchGameJoinRequests,
    fetchGameHasRequested,
  };
}

export default useQueryGames;
