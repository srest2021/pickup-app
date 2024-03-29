import { H4, Text } from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";

const Chatroom = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId, gametype } = route.params;

  const [session, user, loading] = useStore((state) => [
    state.session,
    state.user,
    state.loading,
  ]);

  //const convertedGame = gametype === "my" ? (game as FeedGame) : (game as JoinedGame);

  return (
    <View>
      {session && session.user && user ? (
        <View>
          <H4>Chatroom</H4>
        </View>
      ) : (
        <View className="items-center justify-center flex-1 p-12 text-center">
          <H4>Log in to chat!</H4>
        </View>
      )}
    </View>
  );
};

export default Chatroom;
