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
