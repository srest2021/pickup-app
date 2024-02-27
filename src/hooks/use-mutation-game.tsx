import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Game } from "../lib/types";

function useMutationGame() {
  const [session, setSession, setLoading, setUpdateGameStatus, addMyGame] =
    useStore((state) => [
      state.session,
      state.setSession,
      state.setLoading,
      state.setUpdateGameStatus,
      state.addMyGame,
    ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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

      // Successful game creation.
      setUpdateGameStatus(true);

      // Temporary work around.
      let gameId: string = "";
      if (data) {
        gameId = data[0];
      }

      const myNewGame: Game = {
        id: gameId,
        title: game_title,
        description: description,
        datetime: datetime,
        address: address,
        sport: { name: sport, skillLevel: skillLevel },
        maxPlayers: Number(playerLimit),
      };
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { createGame };
}

export default useMutationGame;
