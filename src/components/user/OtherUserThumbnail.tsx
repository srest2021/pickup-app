import { OtherUser, User } from "../../lib/types";
import {
  Button,
  Card,
  H4,
  H5,
  H6,
  Image,
  View,
  Paragraph,
  XStack,
} from "tamagui";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase";

export default function OtherUserThumbnail({
  navigation,
  otherUser,
}: {
  navigation: any;
  otherUser: OtherUser;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const fetchData = async (avatarPath: string) => {
    if (avatarPath) {
      try {
        await downloadImage(avatarPath);
      } catch (error) {
        Alert.alert("Error getting game organizer");
      }
    }
  };

  async function downloadImage(path: string) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) throw error;

    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      setAvatarUrl(fr.result as string);
    };
  }

  return (
    <View paddingLeft="$5" paddingRight="$5">
      <Card elevate size="$5">
        <Card.Header padded>
          <XStack
            style={{ justifyContent: "space-between", overflow: "hidden" }}
          >
                <XStack space="$2" alignItems="center">
                  {avatarUrl && (
                    <Image
                      source={{ uri: avatarUrl, width: 60, height: 60 }}
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                      accessibilityLabel="Avatar"
                    />
                  )}
                  <Paragraph fontSize={20} >@{otherUser?.displayName}</Paragraph>
                </XStack>
            <View style={{ objectPosition: "absolute" }}>
              <Button
                style={{ backgroundColor: "#ff7403" }}
                onPress={()=>{}}
              >
                <H5 style={{ color: "#ffffff" }}>
                  Profile 
                </H5>
              </Button>
            </View>
          </XStack>
        </Card.Header>
        <View
          space="$2"
          alignSelf="baseline"
          marginLeft={25}
          style={{ flex: 0.5 }}
        >
        </View>
        <Card.Footer padded>
          <View
            alignItems="center"
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
          </View>
        </Card.Footer>
        <Card.Background>
        </Card.Background>
      </Card>
    </View>
  );
}
