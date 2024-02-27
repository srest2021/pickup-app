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
    //state.setSession,
    state.setLoading,
    state.setUpdateGameStatus,
    state.addMyGame,
    state.removeMyGame,
    state.editMyGame,
  ]);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });
  // }, []);

  const createGame = async (
    game_title: string,
    datetime: Date,
    address: string,
    sport: string,
    skillLevel: number,
    playerLimit: string,
    description: string = "",
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

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
            address: address,
            max_players: playerLimit,
          },
        ])
        .select();
      if (error) throw error;

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
        // return myNewGame.id;
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
    sport: string,
    skillLevel: number,
    playerLimit: string,
    description: string = "",
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("games")
        .update({
          title: game_title,
          description: description,
          datetime: datetime,
          sport: sport,
          skill_level: skillLevel,
          address: address,
          max_players: playerLimit,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

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

  return { createGame, removeGameById };
}

export default useMutationGame;
