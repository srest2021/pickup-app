import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { SkillLevel, GameSport, Game } from "../lib/types";

function useMutationGame() {
  const [session, setLoading, addMyGame, editMyGame] = useStore((state) => [
    state.session,
    state.setLoading,
    state.addMyGame,
    state.editMyGame,
  ]);

  // Radio group value is only string. Convert string skill level to number
  function convertSkillLevel(skillLevel: string): SkillLevel {
    switch (skillLevel) {
      case "0":
        return SkillLevel.Beginner;
      case "1":
        return SkillLevel.Intermediate;
      case "2":
        return SkillLevel.Advanced;
      default:
        return SkillLevel.Beginner;
    }
  }

  const createGame = async (
    title: string,
    date: string,
    time: string,
    address: string,
    sport: string,
    skillLevel: string,
    playerLimit: string,
    description: string = "",
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      // Convert the date + time into timestampz type
      const combinedDateTime = new Date(`${date}T${time}:00.000Z`);
      const isoDateTimeString = combinedDateTime.toISOString();

      const { data, error } = await supabase
        .from("games")
        .insert([
          {
            organizer_id: session?.user.id,
            title,
            description: description,
            datetime: isoDateTimeString,
            sport: sport,
            skill_level: convertSkillLevel(skillLevel),
            address: address,
            max_players: playerLimit,
          },
        ])
        .select();
      //console.log(data);

      const myGame: Game = {
        id: data[0]?.id,
        title: data[0]?.title,
        description: data[0]?.description,
        datetime: new Date(data[0]?.datetime),
        address: data[0]?.address,
        sport: {
          name: data[0]?.sport,
          skillLevel: data[0]?.skill_level,
        } as GameSport,
        maxPlayers: data[0]?.max_players,
      };
      //console.log(myGame);
      addMyGame(myGame);
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
