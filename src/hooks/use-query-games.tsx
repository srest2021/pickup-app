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
    fg,
    fgfo,
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
    state.feedGames,
    state.feedGamesFriendsOnly
  ]);

  const { getUserLocation } = useQueryUsers();

  const fetchMyGames = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view games");

      //if no location, for now, default location is charmander marmander
      const lat = location ? location.coords.latitude : 39.3289357;
      const long = location ? location.coords.longitude : -76.6172978;

      const { data, error } = await supabase.rpc("my_games", {
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
            address: {
              street: game.street,
              city: game.city,
              state: game.state,
              zip: game.zip,
            } as Address,
            sport: {
              name: game.sport,
              skillLevel: game.skill_level,
            } as GameSport,
            maxPlayers: Number(game.max_players),
            currentPlayers: Number(game.current_players),
            isPublic: game.is_public,
            distanceAway: location ? Math.trunc(Number(game.dist_meters)) : "?",
            joinRequests: game.join_requests ? game.join_requests : [],
            acceptedPlayers: game.accepted_players ? game.accepted_players : [],
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

      const { data, error } = await supabase.rpc("joined_games", {
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
            address: {
              street: game.street,
              city: game.city,
              state: game.state,
              zip: game.zip,
            } as Address,
            sport: {
              name: game.sport,
              skillLevel: game.skill_level,
            } as GameSport,
            maxPlayers: Number(game.max_players),
            currentPlayers: Number(game.current_players),
            isPublic: Boolean(game.is_public),
            distanceAway: location ? Math.trunc(Number(game.dist_meters)) : "?",
            acceptedPlayers: game.accepted_players ? game.accepted_players : [],
            organizer: { ...game.organizer },
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

      const { data, error } = await supabase
        .rpc(friendsOnly ? "friends_only_games" : "nearby_games", {
          lat: location.coords.latitude,
          long: location.coords.longitude,
          dist_limit: 10000000, //filterDist, TEMP FIX
          sport_filter: filterSport,
          skill_level_filter: filterLevel,
        })
        .range(offset, offset+20);
      if (error) throw error;

      console.log(`query ${friendsOnly ? "friends_only_games" : "nearby_games"} with range ${offset}-${offset+20}, got ${data.length} games`)

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
            distanceAway: Math.trunc(Number(game.dist_meters)),
            acceptedPlayers: game.accepted_players ? game.accepted_players : [],
            hasRequested: Boolean(game.has_requested),
            organizer: { ...game.organizer },
          };
          return feedGame;
        });
        friendsOnly ? setFeedGamesFriendsOnly(games) : setFeedGames(games);
        //console.log(fg) 
        console.log("DATA")
        data.forEach((elem) => console.log(elem.title, elem.organizer.username))
        console.log("FEEDGAMES")
        fg.forEach((game) => console.log(game.title, game.organizer.username))
        //console.log(fgfo)
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

  return {
    myGames,
    fetchMyGames,
    fetchJoinedGames,
    fetchFeedGames,
  };
}

export default useQueryGames;
