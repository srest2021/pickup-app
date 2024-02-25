import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

function useMutationGame() {
  const [session, user, setSession, setLoading] = useStore(
    (state) => [
      state.session,
      state.user,
      state.setSession,
      state.setLoading,
      state.setUser,
      state.editUser,
    ],
  );

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
    datetime: string,
    address: string,
    sport: string,
    skillLevel: number,
    playerLimit: string,
    description: string,
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      // Notes:
      // should we save the current_players for the next iteration when we allow palyers to join game
      const { data, error } = await supabase
        .from("games")
        .insert([
          {
            id: "someValue",
            created_at: "otherValue",
            time: "",
            date: "",
            sport: "",
            address: "",
            organizer_id: session?.user.id,
            max_players: "",
            current_players: "",
            skill_level: "",
          },
        ])
        .select();
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
