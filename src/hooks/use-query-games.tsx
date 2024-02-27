import { useEffect } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

function useQueryGames() {
  const [session, setSession, setLoading, setMyGames] = useStore(
    (state) => [
      state.session,
      state.setSession,
      state.setLoading,
      state.setMyGames,
    ]
  );

  useEffect(() => {
    const fetchMyGames = async () => {
      try {
        setLoading(true);
        if (!session?.user) throw new Error("Please sign in to view games");

        const { data: games, error } = await supabase
          .from("games")
          .select("*")
          .eq("organizer_id", session.user.id);

        if (error) {
          throw error;
        }

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
        const { data: games, error } = await supabase.from("games").select("*").limit(20);

        if (error) {
          throw error;
        }

        if (games) {
          // Update the state with all games
          // You might want to update the state differently for all games
          // Maybe you want to distinguish between user's games and all games
          // You can adjust this part based on your application's requirements
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

    if (session?.user) {
      fetchMyGames();
    }
    
    fetchAllGames();
  }, [session, setMyGames, setLoading]);

  return {};
}

export default useQueryGames;
