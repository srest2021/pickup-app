import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Address, MyGame, GameSport } from "../lib/types";
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

async function readHTMLFile() {
  try {
      //const html = await fs.promises.readFile(filePath, 'utf8');
      //return html;
      //Load asset
      const asset = Asset.fromModule(require('email_template.html'));
      await asset.downloadAsync();

      //Read file
      const html = await FileSystem.readAsStringAsync(asset.localUri || '');
      return html;
  } catch (err) {
      console.error('Error reading HTML file:', err);
      return null;
  }
}

function useMutationGame() {
  const [
    session,
    user,
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
    state.user,
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

  const checkGameOverlap = async (
    datetime: Date,
    street: string,
    city: string,
    state: string,
    zip: string,
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase.rpc("is_game_overlap", {
        city_param: city,
        datetime_param: datetime,
        state_param: state,
        street_param: street,
        zip_param: zip,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error publishing game! Please try again later.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendEmailToFriends = async (
    username: string | undefined,
    title: string,
    datetime: Date,
  ) => {
    try {
      const { data: emails, error: error1 } =
        await supabase.rpc("get_friends_emails");
      if (error1) throw error1;

      const formattedDate = datetime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
      const formattedUsername = username ? `@${username} ` : "";
      //const formattedHtml = `<strong>Your friend ${formattedUsername}just created a game titled "${title}" on ${formattedDate}.</strong><br><br>Open the app to join the game!`;
      //const htmlFilePath = 'email_template.html';
      const htmlContent = await readHTMLFile();
      if (!htmlContent) throw new Error('HTML content not available.');

      const formattedHtml = htmlContent
          .replace('{formattedUsername}', formattedUsername)
          .replace('{gameTitle}', title);

      const { data, error: error2 } = await supabase.functions.invoke(
        "resend2",
        {
          body: {
            to: emails,
            subject: "PickupApp: Your friend just created a game on Pickup!",
            html: formattedHtml,
          },
        },
      );
      if (error2) throw error2;
    } catch (error) {
      Alert.alert("Error sending email notifications to friends!");
      // don't do anything else if email notifications failed;
      // just alert and continue with creating the game as usual
    }
  };

  const sendEmailForJoinRequest = async (
    username: string | undefined,
    gameTitle: string | undefined,
    organizerId: string | undefined,
  ) => {
    try {
      const { data: email, error: error1 } = await supabase.rpc(
        "get_user_email",
        { user_id: organizerId },
      );
      if (error1) {
        throw error1;
      }
      const formattedUsername = username ? `@${username}` : "A user";
      const formattedHtml = `<strong>${formattedUsername} requested to join a game you organized, ${gameTitle}!</strong><br><br>Open the app to interact!`;
      const { data, error: error2 } = await supabase.functions.invoke(
        "resend2",
        {
          body: {
            to: email,
            subject: "PickupApp: A user just requested to join your game!",
            html: formattedHtml,
          },
        },
      );
      if (error2) throw error2;
    } catch (error) {
      Alert.alert("Error sending email notifications for game join requests!");
      // don't do anything else if email notifications failed;
      // just alert and continue with creating the game as usual
    }
  };

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

        // send email notification to friends
        if (!isPublic)
          await sendEmailToFriends(user?.username, title, datetime);

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

  const acceptJoinRequestById = async (
    gameId: string,
    playerId: string,
    plusOne: boolean,
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      // Check if game full or if num of players requesting will exceed max
      let { data, error } = await supabase.rpc("check_game_capacity", {
        game_id: gameId,
        player_id: playerId,
        plus_one: plusOne,
      });

      if (error) throw error;

      if (!data) {
        Alert.alert(
          "Error: Accepting this request will exceed the max player capacity!",
        );
        return null;
      }

      const { error: error1 } = await supabase.rpc("accept_join_request", {
        game_id: gameId,
        player_id: playerId,
      });
      if (error1) throw error1;

      acceptJoinRequest(gameId, playerId, plusOne);
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

  const removePlayerById = async (
    gameId: string,
    playerId: string,
    plusOne: boolean,
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { error } = await supabase.rpc("remove_player", {
        game_id: gameId,
        player_id: playerId,
      });
      if (error) throw error;

      removePlayer(gameId, playerId, plusOne);
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

  const requestToJoinById = async (
    gameId: string,
    gameTitle: string | undefined,
    organizerId: string | undefined,
    playerId: string,
    plusOne: boolean,
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      // Check if game full or if num of players requesting will exceed max
      let { data, error } = await supabase.rpc("check_game_capacity", {
        game_id: gameId,
        player_id: playerId,
        plus_one: plusOne,
      });
      if (error) throw error;
      if (!data) {
        Alert.alert("This game is already full!");
        return true;
      }

      const { data: data1, error: error1 } = await supabase
        .from("game_requests")
        .insert([
          {
            game_id: gameId,
            player_id: playerId,
            plus_one: plusOne,
          },
        ])
        .select();
      if (error1) throw error;
      // update hasRequested for selectedFeedGame and feed games
      updateHasRequestedFeedGame(gameId);

      // send email notification
      await sendEmailForJoinRequest(user?.username, gameTitle, organizerId);

      return false;
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

      let { error } = await supabase.rpc("remove_player", {
        game_id: gameId,
        player_id: playerId,
      });
      if (error) throw error;

      removeJoinedGame(gameId);
      return true;
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
    checkGameOverlap,
  };
}

export default useMutationGame;
