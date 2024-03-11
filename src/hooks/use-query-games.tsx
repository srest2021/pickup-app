import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Address, GameSport, MyGame, JoinedGame, FeedGame } from "../lib/types";

function useQueryGames() {
  const [
    session,
    setLoading,
    myGames,
    setMyGames,
    clearMyGames,
    setFeedGames,
    clearFeedGames,
    setJoinedGames,
    clearJoinedGames,
    location,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.myGames,
    state.setMyGames,
    state.clearMyGames,
    state.setFeedGames,
    state.clearFeedGames,
    state.setJoinedGames,
    state.clearJoinedGames,
    state.location,
  ]);

  const fetchMyGames = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view games");

      let lat = 39.3289357; //if no location, for now, default location is charmander marmander
      let long = -76.6172978;

      if (location != null) {
        lat = location.coords.latitude;
        long = location.coords.longitude;
      }

      const { data, error } = await supabase.rpc("my_games", {
        lat: lat,
        long: long,
      });
      if (error) throw error;

      if (data) {
        const games = data.map((game: any) => {
          const myGame: MyGame = {
            id: game.id,
            organizerId: game.organizer_id,
            title: game.title,
            description: game.description,
            datetime: game.datetime,
            address: {
              street: game.street,
              city: game.city,
              state: game.state,
              zip: game.zip,
            } as Address,
            sport: {
              name: game.sport,
              skillLevel: game.skill_level,
            } as GameSport,
            maxPlayers: Number(game.max_players),
            currentPlayers: Number(game.current_players),
            isPublic: game.is_public,
            distanceAway: Math.trunc(Number(game.dist_meters) * 100) / 100,
            joinRequests: game.join_requests ? game.join_requests : [],
            acceptedPlayers: game.accepted_players ? game.accepted_players : [],
          };
          return myGame;
        });
        setMyGames(games);
      } else {
        throw new Error("Error fetching my games! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching my games! Please try again later.");
      }
      clearMyGames();
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedGames = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Please sign in to view games");

      const { data, error } = await supabase.rpc("joined_games", {
        lat: 39.3289357,
        long: -76.6172978,
      });
      if (error) throw error;

      if (data) {
        const games = data.map((game: any) => {
          const joinedGame: JoinedGame = {
            id: game.id,
            organizerId: game.organizer_id,
            title: game.title,
            description: game.description,
            datetime: game.datetime,
            address: {
              street: game.street,
              city: game.city,
              state: game.state,
              zip: game.zip,
            } as Address,
            sport: {
              name: game.sport,
              skillLevel: game.skill_level,
            } as GameSport,
            maxPlayers: Number(game.max_players),
            currentPlayers: Number(game.current_players),
            isPublic: game.is_public,
            distanceAway: Math.trunc(Number(game.dist_meters) * 100) / 100,
            acceptedPlayers: game.accepted_players ? game.accepted_players : [],
          };
          return joinedGame;
        });
        setJoinedGames(games);
      } else {
        throw new Error("Error fetching joined games! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching joined games! Please try again later.");
      }
      clearJoinedGames();
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc("nearby_games", {
          lat: 39.3289357,
          long: -76.6172978,
        })
        .limit(20);
      if (error) throw error;

      if (data) {
        const games = data.map((game: any) => {
          const feedGame: FeedGame = {
            id: game.id,
            organizerId: game.organizer_id,
            title: game.title,
            description: game.description,
            datetime: game.datetime,
            sport: {
              name: game.sport,
              skillLevel: game.skill_level,
            } as GameSport,
            maxPlayers: Number(game.max_players),
            currentPlayers: Number(game.current_players),
            isPublic: game.is_public,
            distanceAway: Math.trunc(Number(game.dist_meters) * 100) / 100,
            acceptedPlayers: game.accepted_players ? game.accepted_players : [],
            hasRequested: Boolean(game.has_requested),
          };
          return feedGame;
        });
        setFeedGames(games);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching feed games! Please try again later.");
      }
      clearFeedGames();
    } finally {
      setLoading(false);
    }
  };

  // const fetchFeedGameById = async (id: string) => {
  //   try {
  //     setLoading(true);
  //     if (!session?.user) throw new Error("Please sign in to view a game");

  //     const { data, error } = await supabase.rpc("get_game_without_address", {
  //       game_id: id,
  //       lat: 39.3289357,
  //       long: -76.6172978,
  //     });
  //     if (error) throw error;

  //     if (data && data[0]) {
  //       const game: FeedGame = {
  //         id: data["row"].f1,
  //         organizerId: data["row"].f2,
  //         title: data["row"].f3,
  //         description: data["row"].f4,
  //         datetime: new Date(data["row"].f5),
  //         sport: {
  //           name: data["row"].f6,
  //           skillLevel: data["row"].f7,
  //         } as GameSport,
  //         maxPlayers: Number(data["row"].f8),
  //         currentPlayers: Number(data["row"].f9),
  //         isPublic: data["row"].f10,
  //         distanceAway: Number(data["row"].f11),
  //         acceptedPlayers: data["row"].f12,
  //       };

  //       setSelectedFeedGame(game);
  //       return game;
  //     } else {
  //       throw new Error("Error loading feed game! Please try again later.");
  //     }
  //   } catch (error) {
  //     clearSelectedFeedGame();
  //     if (error instanceof Error) {
  //       Alert.alert(error.message);
  //     } else {
  //       Alert.alert("Error loading feed game! Please try again later.");
  //     }
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchJoinedGameById = async (id: string) => {
  //   try {
  //     setLoading(true);
  //     if (!session?.user) throw new Error("Please sign in to view a game");

  //     const { data, error } = await supabase.rpc("get_game_with_address", {
  //       game_id: id,
  //       lat: 39.3289357,
  //       long: -76.6172978,
  //     });
  //     if (error) throw error;

  //     if (data && data["row"]) {
  //       const game: JoinedGame = {
  //         id: data["row"].f1,
  //         organizerId: data["row"].f2,
  //         title: data["row"].f3,
  //         description: data["row"].f4,
  //         datetime: new Date(data["row"].f5),
  //         address: {
  //           street: data["row"].f6,
  //           city: data["row"].f7,
  //           state: data["row"].f8,
  //           zip: data["row"].f9,
  //         } as Address,
  //         sport: {
  //           name: data["row"].f10,
  //           skillLevel: data["row"].f11,
  //         } as GameSport,
  //         maxPlayers: Number(data["row"].f12),
  //         currentPlayers: Number(data["row"].f13),
  //         isPublic: data["row"].f14,
  //         distanceAway: Number(data["row"].f15),
  //         acceptedPlayers: data["row"].f16,
  //       };

  //       setSelectedJoinedGame(game);
  //       return game;
  //     } else {
  //       throw new Error("Error loading joined game! Please try again later.");
  //     }
  //   } catch (error) {
  //     clearSelectedJoinedGame();
  //     if (error instanceof Error) {
  //       Alert.alert(error.message);
  //     } else {
  //       Alert.alert("Error loading joined game! Please try again later.");
  //     }
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchMyGameById = async (id: string) => {
  //   try {
  //     setLoading(true);
  //     if (!session?.user) throw new Error("Please sign in to view a game");

  //     const { data, error } = await supabase.rpc("get_game_with_address", {
  //       game_id: id,
  //       lat: 39.3289357,
  //       long: -76.6172978,
  //     });
  //     if (error) throw error;

  //     if (data && data["row"]) {
  //       const game: MyGame = {
  //         id: data["row"].f1,
  //         organizerId: data["row"].f2,
  //         title: data["row"].f3,
  //         description: data["row"].f4,
  //         datetime: new Date(data["row"].f5),
  //         address: {
  //           street: data["row"].f6,
  //           city: data["row"].f7,
  //           state: data["row"].f8,
  //           zip: data["row"].f9,
  //         } as Address,
  //         sport: {
  //           name: data["row"].f10,
  //           skillLevel: data["row"].f11,
  //         } as GameSport,
  //         maxPlayers: Number(data["row"].f12),
  //         currentPlayers: Number(data["row"].f13),
  //         isPublic: data["row"].f14,
  //         distanceAway: Number(data["row"].f15),
  //         joinRequests: data["row"].f16,
  //         acceptedPlayers: data["row"].f17,
  //       };

  //       setSelectedMyGame(game);
  //       return game;
  //     } else {
  //       throw new Error("Error loading my game! Please try again later.");
  //     }
  //   } catch (error) {
  //     clearSelectedMyGame();
  //     if (error instanceof Error) {
  //       Alert.alert(error.message);
  //     } else {
  //       Alert.alert("Error loading my game! Please try again later.");
  //     }
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    myGames,
    fetchMyGames,
    fetchJoinedGames,
    fetchFeedGames,
  };
}

export default useQueryGames;
