import { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import {
  Address,
  Game,
  GameSport,
  GameWithAddress,
  GameWithoutAddress,
} from "../lib/types";

function useQueryGames() {
  const [
    session,
    setLoading,
    myGames,
    setMyGames,
    setFeedGames,
    setSelectedFeedGame,
    clearSelectedFeedGame,
    setSelectedMyGame,
    clearSelectedMyGame,
    setSelectedJoinedGame,
    clearSelectedJoinedGame,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.myGames,
    state.setMyGames,
    state.setFeedGames,
    state.setSelectedFeedGame,
    state.clearSelectedFeedGame,
    state.setSelectedMyGame,
    state.clearSelectedMyGame,
    state.setSelectedJoinedGame,
    state.clearSelectedJoinedGame,
  ]);

  const fetchFeedGameById = async (id: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view a game");

      const { data, error } = await supabase.rpc("get_game_without_address", {
        game_id: id,
      });
      if (error) throw error;

      if (data && data[0]) {
        const game: GameWithoutAddress = {
          id: data[0].id,
          organizerId: data[0].organizer_id,
          title: data[0].title,
          description: data[0].description,
          datetime: new Date(data[0].datetime),
          sport: {
            name: data[0].sport,
            skillLevel: data[0].skill_level,
          } as GameSport,
          maxPlayers: Number(data[0].max_players),
          currentPlayers: Number(data[0].current_players),
          isPublic: data[0].is_public,
        };

        setSelectedFeedGame(game);
        return game;
      } else {
        throw new Error("Error loading feed game! Please try again later.");
      }
    } catch (error) {
      clearSelectedFeedGame();
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error loading feed game! Please try again later.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedGameById = async (id: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view a game");

      const { data, error } = await supabase.rpc("get_game_with_address", {
        game_id: id,
      });
      if (error) throw error;

      if (data && data[0]) {
        const game: GameWithAddress = {
          id: data[0].id,
          organizerId: data[0].organizer_id,
          title: data[0].title,
          description: data[0].description,
          datetime: new Date(data[0].datetime),
          address: {
            street: data[0].street,
            city: data[0].city,
            state: data[0].state,
            zip: data[0].zip,
          },
          sport: {
            name: data[0].sport,
            skillLevel: data[0].skill_level,
          } as GameSport,
          maxPlayers: Number(data[0].max_players),
          currentPlayers: Number(data[0].current_players),
          isPublic: data[0].is_public,
        };

        setSelectedJoinedGame(game);
        return game;
      } else {
        throw new Error("Error loading joined game! Please try again later.");
      }
    } catch (error) {
      clearSelectedJoinedGame();
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error loading joined game! Please try again later.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGameById = async (id: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view a game");

      const { data, error } = await supabase.rpc("get_game_with_address", {
        game_id: id,
      });
      console.log("FETCHMYGAME",data,error);
      if (error) throw error;

      if (data && data["row"]) {
        const game: GameWithAddress = {
          id: data["row"].f1,
          organizerId: data["row"].f2,
          title: data["row"].f3,
          description: data["row"].f4,
          datetime: new Date(data["row"].f5),
          address: {
            street: data["row"].f6,
            city: data["row"].f7,
            state: data["row"].f8,
            zip: data["row"].f9,
          },
          sport: {
            name: data["row"].f10,
            skillLevel: data["row"].f11,
          } as GameSport,
          maxPlayers: Number(data["row"].f12),
          currentPlayers: Number(data["row"].f13),
          isPublic: data["row"].f14,
        };

        setSelectedMyGame(game);
        return game;
      } else {
        throw new Error("Error loading my game! Please try again later.");
      }
    } catch (error) {
      clearSelectedMyGame();
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error loading my game! Please try again later.")
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGames = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view games");

      const { data, error } = await supabase.rpc("my_games");
      if (error) throw error;

      if (data) {
        const games = data.map((myGame: any) => {
          const game: GameWithAddress = {
            id: myGame.id,
            organizerId: myGame.organizer_id,
            title: myGame.title,
            description: myGame.description,
            datetime: myGame.datetime,
            address: {
              street: myGame.street,
              city: myGame.city,
              state: myGame.state,
              zip: myGame.zip,
            } as Address,
            sport: {
              name: myGame.sport,
              skillLevel: myGame.skill_level,
            } as GameSport,
            maxPlayers: Number(myGame.max_players),
            currentPlayers: Number(myGame.current_players),
            isPublic: myGame.is_public,
          };
          return game;
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
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGames = async () => {
    try {
      setLoading(true);
      const { data: games, error } = await supabase
        .rpc("nearby_games", {
          lat: 39.3289357,
          long: -76.6172978,
        })
        .limit(20);

      if (error) throw error;

      if (games) {
        setFeedGames(games);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching feed games! Please try again later.")
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    myGames,
    fetchMyGameById,
    fetchJoinedGameById,
    fetchFeedGameById,
    fetchMyGames,
    fetchAllGames,
  };
}

export default useQueryGames;
