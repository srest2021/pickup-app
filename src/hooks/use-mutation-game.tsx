import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Address, MyGame, GameSport } from "../lib/types";

function useMutationGame() {
  const [
    session,
    location,
    setLoading,
    addMyGame,
    removeMyGame,
    editMyGame,
    clearSelectedMyGame,
    acceptJoinRequest,
    rejectJoinRequest,
    removePlayer,
    updateHasRequestedFeedGame,
    removeJoinedGame,
  ] = useStore((state) => [
    state.session,
    state.location,
    state.setLoading,
    state.addMyGame,
    state.removeMyGame,
    state.editMyGame,
    state.clearSelectedMyGame,
    state.acceptJoinRequest,
    state.rejectJoinRequest,
    state.removePlayer,
    state.updateHasRequestedFeedGame,
    state.removeJoinedGame,
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

      //if no location, for now, default location is charmander marmander
      const lat = location ? location.coords.latitude : 39.3289357;
      const long = location ? location.coords.longitude : -76.6172978;

      const { data, error } = await supabase.rpc("create_game", {
        title,
        description,
        datetime,
        street,
        city,
        state,
        zip,
        sport,
        skill_level: skillLevel,
        max_players: playerLimit,
        is_public: isPublic,
        lat: lat,
        long: long,
      });
      if (error) throw error;

      if (data && data["row"]) {
        // add game to store
        const myNewGame: MyGame = {
          id: data["row"].f1,
          organizerId: data["row"].f2,
          title,
          description,
          datetime,
          address: { street, city, state, zip } as Address,
          sport: { name: sport, skillLevel: skillLevel } as GameSport,
          maxPlayers: Number(playerLimit),
          currentPlayers: 1,
          isPublic,
          distanceAway: location
            ? Math.trunc(Number(data["row"].f15) / 1609.344)
            : "?",
          joinRequests: [],
          acceptedPlayers: [],
        };
        addMyGame(myNewGame);
        return myNewGame;
      } else {
        throw new Error("Error publishing game! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error publishing game! Please try again later.");
      }
      return null;
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
      return id;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error deleting game! Please try again later.");
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

      //if no location, for now, default location is charmander marmander
      const lat = location ? location.coords.latitude : 39.3289357;
      const long = location ? location.coords.longitude : -76.6172978;

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
        skill_level: skillLevel,
        max_players: playerLimit,
        is_public: isPublic,
        lat: lat,
        long: long,
      });
      if (error) throw error;

      if (data && data["row"]) {
        // edit game in store
        const myUpdatedGame = {
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
          } as Address,
          sport: {
            name: data["row"].f10,
            skillLevel: data["row"].f11,
          } as GameSport,
          maxPlayers: Number(data["row"].f12),
          currentPlayers: Number(data["row"].f13),
          isPublic: data["row"].f14,
          distanceAway: location
            ? Math.trunc(Number(data["row"].f15) / 1609.344)
            : "?",
        };
        editMyGame(myUpdatedGame.id, myUpdatedGame);
        return myUpdatedGame;
      } else {
        throw new Error("Error editing game! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error editing game! Please try again later.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const acceptJoinRequestById = async (gameId: string, playerId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { error } = await supabase.rpc("accept_join_request", {
        game_id: gameId,
        player_id: playerId,
      });
      if (error) throw error;

      acceptJoinRequest(gameId, playerId);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error accepting join request! Please try again later.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rejectJoinRequestById = async (gameId: string, playerId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { error } = await supabase.rpc("reject_join_request", {
        game_id: gameId,
        player_id: playerId,
      });
      if (error) throw error;

      rejectJoinRequest(gameId, playerId);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error rejecting join request! Please try again later.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removePlayerById = async (gameId: string, playerId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { error } = await supabase.rpc("remove_player", {
        game_id: gameId,
        player_id: playerId,
      });
      if (error) throw error;

      removePlayer(gameId, playerId);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error removing player! Please try again later.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const requestToJoinById = async (gameId: string, playerId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("game_requests")
        .insert([
          {
            game_id: gameId,
            player_id: playerId,
          },
        ])
        .select();
      if (error) throw error;

      // update hasRequested for selectedFeedGame and feed games
      updateHasRequestedFeedGame(gameId);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error sending join request! Please try again later.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const leaveJoinedGameById = async (gameId: string, playerId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error } = await supabase.rpc("remove_player", {
        game_id: gameId,
        player_id: playerId,
      });
      if (error) throw error;

      removeJoinedGame(gameId);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error leaving joined game! Please try again later.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createGame,
    removeMyGameById,
    editGameById,
    acceptJoinRequestById,
    rejectJoinRequestById,
    removePlayerById,
    requestToJoinById,
    leaveJoinedGameById,
  };
}

export default useMutationGame;
