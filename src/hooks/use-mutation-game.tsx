import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Address, Game, GameSport, GameWithAddress } from "../lib/types";

function useMutationGame() {
  const [
    session,
    setLoading,
    addMyGame,
    removeMyGame,
    editMyGame,
    clearSelectedMyGame,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.addMyGame,
    state.removeMyGame,
    state.editMyGame,
    state.clearSelectedMyGame,
  ]);

  const createGame = async (
    title: string,
    datetime: Date,
    street: string,
    city: string,
    state: string,
    zip: string,
    sport: string,
    skillLevel: number,
    playerLimit: string,
    description: string = "",
    isPublic: boolean,
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase.rpc("create_game", {
        title,
        description,
        datetime,
        street,
        city,
        state,
        zip,
        sport,
        skillLevel,
        maxPlayers: playerLimit,
        isPublic,
      });
      if (error) throw error;

      if (data && data[0]) {
        // add game to store
        const myNewGame: GameWithAddress = {
          id: data[0].id,
          organizerId: data[0].organizer_id,
          title,
          description,
          datetime,
          address: { street, city, state, zip } as Address,
          sport: { name: sport, skillLevel: skillLevel } as GameSport,
          maxPlayers: Number(playerLimit),
          currentPlayers: 1,
          isPublic,
          //distanceAway
        };
        addMyGame(myNewGame);
        return myNewGame;
      } else {
        throw new Error("Error publishing game! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  const removeMyGameById = async (id: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { error } = await supabase.from("games").delete().eq("id", id);
      if (error) throw error;

      removeMyGame(id);
      clearSelectedMyGame();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const editGameById = async (
    id: string,
    title: string,
    datetime: Date,
    street: string,
    city: string,
    state: string,
    zip: string,
    sport: string,
    skillLevel: number,
    playerLimit: string,
    description: string = "",
    isPublic: boolean,
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase.rpc("edit_game", {
        game_id: id,
        title,
        description,
        datetime,
        street,
        city,
        state,
        zip,
        sport,
        skillLevel,
        maxPlayers: playerLimit,
        isPublic,
      });
      if (error) throw error;

      if (data && data[0]) {
        // edit game in store
        editMyGame(data[0], data);
      } else {
        throw new Error("Error editing game! Please try again later.");
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createGame, removeMyGameById, editGameById };
}

export default useMutationGame;
