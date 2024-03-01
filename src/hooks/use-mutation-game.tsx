import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Game, GameSport } from "../lib/types";

function useMutationGame() {
  const [session, setLoading, addMyGame, removeMyGame, editMyGame] = useStore(
    (state) => [
      state.session,
      state.setLoading,
      state.addMyGame,
      state.removeMyGame,
      state.editMyGame,
    ],
  );

  const getLocation = async (fullAddress: string) => {
    // API key hard coded in -- consider changing
    const geolocationResponse = await fetch(
      `https://geocode.maps.co/search?q=${encodeURIComponent(fullAddress)}&api_key=65e0f4e8bc79e688163432osme79a3d`,
    );
    const geolocationData = await geolocationResponse.json();

    if (geolocationData.length < 1) {
      throw new Error(
        "Unable to fetch geolocation details for the provided address.",
      );
    }

    const latitude = geolocationData[0].lat;
    const longitude = geolocationData[0].lon;
    if (!latitude || !longitude) {
      throw new Error(
        "Unable to fetch geolocation details for the provided address.",
      );
    }

    let location = null;
    if (longitude !== "" && latitude !== "") {
      location = `POINT(${longitude} ${latitude})`;
    }

    return location;
  };

  const createGame = async (
    game_title: string,
    datetime: Date,
    address: string,
    city: string,
    state: string,
    zip: string,
    sport: string,
    skillLevel: number,
    playerLimit: string,
    description: string = "",
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const fullAddress = `${address} ${city} ${state} ${zip}`;
      let location = null;
      try {
        location = await getLocation(fullAddress);
      } catch (error) {
        throw error;
      }

      const { data, error } = await supabase
        .from("games")
        .insert([
          {
            organizer_id: session?.user.id,
            title: game_title,
            description: description,
            datetime: datetime,
            sport: sport,
            skill_level: skillLevel,
            address: fullAddress,
            location,
            current_players: 1,
            max_players: playerLimit,
          },
        ])
        .select();
      if (error) {
        throw error;
      }

      if (data && data[0]) {
        // add game to store
        const myNewGame: Game = {
          id: data[0].id,
          title: game_title,
          description: description,
          datetime: datetime,
          address: address,
          sport: { name: sport, skillLevel: skillLevel } as GameSport,
          maxPlayers: Number(playerLimit),
          currentPlayers: 1,
        };
        addMyGame(myNewGame);
        return myNewGame;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
        //Alert.alert("Error publishing game! Please try again later.");
        return null;
      }
    } finally {
      setLoading(false);
    }
  };

  const removeGameById = async (id: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { error } = await supabase.from("games").delete().eq("id", id);
      if (error) throw error;

      // remove from store
      removeMyGame(id);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editGameById = async (
    id: string,
    game_title: string,
    datetime: Date,
    address: string,
    city: string,
    state: string,
    zip: string,
    sport: string,
    skillLevel: number,
    playerLimit: string,
    description: string = "",
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const fullAddress = `${address} ${city} ${state} ${zip}`;
      let location = null;
      try {
        location = await getLocation(fullAddress);
      } catch (error) {
        throw error;
      }

      const { data, error } = await supabase
        .from("games")
        .update({
          title: game_title,
          description: description,
          datetime: datetime,
          sport: sport,
          skill_level: skillLevel,
          address: fullAddress,
          location: location,
          max_players: playerLimit,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      // Edit game in store
      if (data && data[0]) {
        editMyGame(data[0], data);
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

  return { createGame, removeGameById, editGameById };
}

export default useMutationGame;
