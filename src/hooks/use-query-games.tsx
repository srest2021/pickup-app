import { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Game, GameSport } from "../lib/types";

function useQueryGames() {
  const [
    session,
    setLoading,
    myGames,
    feedGames,
    setMyGames,
    setFeedGames,
    selectedMyGame,
    setSelectedMyGame,
    clearSelectedMyGame,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.myGames,
    state.feedGames,
    state.setMyGames,
    state.setFeedGames,
    state.selectedMyGame,
    state.setSelectedMyGame,
    state.clearSelectedMyGame,
  ]);

  const fetchGameById = async (id: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view a game");

      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", id);
      if (error) throw error;

      if (data && data[0]) {
        const game: Game = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          datetime: new Date(data[0].datetime),
          address: data[0].address,
          city: data[0].city,
          state: data[0].state,
          zip: data[0].zip,
          sport: {
            name: data[0].sport,
            skillLevel: data[0].skill_level,
          } as GameSport,
          maxPlayers: Number(data[0].max_players),
          currentPlayers: Number(data[0].current_players),
        };

        setSelectedMyGame(game);
        return game;
      } else {
        throw new Error("Error loading game; please try again");
      }
    } catch (error) {
      clearSelectedMyGame();
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

      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data, error } = await supabase
        .from("games")
        .select("*")
        .gt("datetime", oneDayAgo.toISOString())
        .eq("organizer_id", session.user.id)
        .order("datetime", { ascending: false });
      if (error) throw error;

      const games = data.map((myGame) => {
        const game: Game = {
          id: myGame.id,
          title: myGame.title,
          description: myGame.description,
          datetime: myGame.datetime,
          address: myGame.address,
          city: myGame.city,
          state: myGame.state,
          zip: myGame.zip,
          sport: {
            name: myGame.sport,
            skillLevel: myGame.skill_level,
          } as GameSport,
          maxPlayers: Number(myGame.max_players),
          currentPlayers: Number(myGame.current_players),
        };
        return game;
      });

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
      const { data: games, error } = await supabase
        .rpc("nearby_games", {
          lat: 39.3289357,
          long: -76.6172978,
        })
        .limit(20);

      //console.log(games);
      //TODO: ADD PAGINATION - right now only returning 20 most relevant games
      /*
      const { data: games, error } = await supabase
        .from("games")
        .select("*")
        .limit(20);
        */
      if (error) throw error;

      if (games) {
        setFeedGames(games);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (session?.user) {
  //     fetchMyGames();
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchAllGames();
  // }, [])

  return {
    selectedMyGame,
    myGames,
    fetchGameById,
    fetchMyGames,
    fetchAllGames,
  };
}

export default useQueryGames;
