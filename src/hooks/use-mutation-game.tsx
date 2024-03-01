import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Game, GameSport } from "../lib/types";

function useMutationGame() {
  const [
    session,
    setLoading,
    setUpdateGameStatus,
    addMyGame,
    removeMyGame,
    editMyGame,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.setUpdateGameStatus,
    state.addMyGame,
    state.removeMyGame,
    state.editMyGame,
  ]);

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

      // API key hard coded in -- consider changing
      const geolocationResponse = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(fullAddress)}&api_key=65e0f4e8bc79e688163432osme79a3d`);
      const geolocationData = await geolocationResponse.json();
      

      const latitude = geolocationData[0].lat;
      const longitude = geolocationData[0].lon;
      
      if (!geolocationData || !geolocationData[0].lat || !geolocationData[0].lon) {
        throw new Error("Unable to fetch geolocation details for the provided address.");
      }



      let location = null;
      if (longitude !== "" && latitude !== "") {
        location = `POINT(${longitude} ${latitude})`;
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
            max_players: playerLimit,
          },
        ])
        .select();
      if (error) {
       // console.log(error);
        throw error;
      }

      // Successful game creation.
      setUpdateGameStatus(true);

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
        };
        addMyGame(myNewGame);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
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
      // API key hard coded in -- consider changing
      const geolocationResponse = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(fullAddress)}&api_key=65e0f4e8bc79e688163432osme79a3d`);
      const geolocationData = await geolocationResponse.json();
      

      const latitude = geolocationData[0].lat;
      const longitude = geolocationData[0].lon;
      
      if (!geolocationData || !geolocationData[0].lat || !geolocationData[0].lon) {
        throw new Error("Unable to fetch geolocation details for the provided address.");
      }

      let location = null;
      if (longitude !== "" && latitude !== "") {
        location = `POINT(${longitude} ${latitude})`;
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
      // Successful game editing.
      setUpdateGameStatus(true);

      // Edit game in store
      if (data && data[0]) {
        editMyGame(data[0], data);
      }
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
