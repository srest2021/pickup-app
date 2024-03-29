import { H4, Text } from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import { JoinedGame, MyGame } from "../../lib/types";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

const Chatroom = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gametype } = route.params;

  const [session, user, loading, roomCode, selectedMyGame, selectedJoinedGame] =
    useStore((state) => [
      state.session,
      state.user,
      state.loading,
      state.roomCode,
      state.selectedMyGame,
      state.selectedJoinedGame,
    ]);

  // let convertedGame;
  // if (gametype == "my") {
  //   convertedGame = selectedMyGame as MyGame;
  // } else {
  //   convertedGame = selectedJoinedGame as JoinedGame;
  // }

  return (
    <View>
      {session && session.user && user ? (
        <View>
          <H4>Chatroom</H4>
          <ChatWindow />
          <MessageInput />
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
