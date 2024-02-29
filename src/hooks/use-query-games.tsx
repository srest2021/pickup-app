import { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Game, GameSport } from "../lib/types";

function useQueryGames() {
  const [
    session,
    setLoading,
    setMyGames,
    setSelectedGameId,
    clearSelectedGameId,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.setMyGames,
    state.setSelectedGameId,
    state.clearSelectedGameId,
  ]);

  const [game, setGame] = useState<Game | null>(null);

  const fetchGameById = async (id: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view a game");

      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", id);
      if (error) throw error;
      //console.log(data);

      if (data && data[0]) {
        const game: Game = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          datetime: data[0].datetime,
          address: data[0].address,
          sport: {
            name: data[0].sport,
            skillLevel: data[0].skill_level,
          } as GameSport,
          maxPlayers: Number(data[0].max_players),
        };

        setGame(game);
        setSelectedGameId(game.id);
        return game;
      } else {
        throw new Error("Error loading game; please try again");
      }
    } catch (error) {
      setGame(null);
      clearSelectedGameId();
      if (error instanceof Error) {
        Alert.alert(error.message);
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

      const { data: games, error } = await supabase
        .from("games")
        .select("*")
        .eq("organizer_id", session.user.id);
      if (error) throw error;

      if (games) {
        setMyGames(games);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllGames = async () => {
    try {
      setLoading(true);

      //TODO: ADD PAGINATION - right now only returning 20 most relevant games
      const { data: games, error } = await supabase
        .from("games")
        .select("*")
        .limit(20);
      if (error) throw error;

      if (games) {
        setMyGames(games);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //fetchGame("37bc2b67-020e-4b58-911a-c6a1864954f5"); //test
    if (session?.user) {
      fetchMyGames();
    }
    fetchAllGames();
  }, []);

  return { fetchGameById, fetchMyGames, fetchAllGames };
}

export default useQueryGames;
