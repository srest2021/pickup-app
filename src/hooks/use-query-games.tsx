import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import {
  Address,
  GameSport,
  MyGame,
  JoinedGame,
  FeedGame,
  User,
} from "../lib/types";

function useQueryGames() {
  const [
    session,
    setLoading,
    myGames,
    setMyGames,
    clearMyGames,
    setFeedGames,
    clearFeedGames,
    setJoinedGames,
    clearJoinedGames,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.myGames,
    state.setMyGames,
    state.clearMyGames,
    state.setFeedGames,
    state.clearFeedGames,
    state.setJoinedGames,
    state.clearJoinedGames,
  ]);

  const fetchMyGames = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view games");

      const { data, error } = await supabase.rpc("my_games", {
        lat: 39.3289357,
        long: -76.6172978,
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
            distanceAway: Math.trunc(Number(game.dist_meters)*100)/100,
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
      if (!session?.user) throw new Error("Please sign in to view games");

      const { data, error } = await supabase.rpc("joined_games", {
        lat: 39.3289357,
        long: -76.6172978,
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
            isPublic: game.is_public,
            distanceAway: Math.trunc(Number(game.dist_meters)*100)/100,
            acceptedPlayers: game.accepted_players ? game.accepted_players : [],
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

  const fetchFeedGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc("nearby_games", {
          lat: 39.3289357,
          long: -76.6172978,
        })
        .limit(20);
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
            isPublic: game.is_public,
            distanceAway: Math.trunc(Number(game.dist_meters)*100)/100,
            acceptedPlayers: game.accepted_players ? game.accepted_players : [],
          };
          return feedGame;
        });
        setFeedGames(games);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching feed games! Please try again later.");
      }
      clearFeedGames();
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
