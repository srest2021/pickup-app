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
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { useStore } from "../../lib/store";
import { ArrowRightSquare } from "@tamagui/lucide-icons";

export default function OtherUserThumbnail({
  navigation,
  otherUserEntered,
}: {
  navigation: any;
  otherUserEntered: OtherUser;
}) {
  //const [setOtherUser] = useStore((state)=>{state.setOtherUser}); 
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [bio, setBio] = useState<string>('');

  useEffect(() => {
    setUsername(otherUserEntered ? otherUserEntered.username : null);
    setBio(otherUserEntered ? otherUserEntered.bio : '');
    const abbrevDescription =
    bio.length > 100
      ? bio.substring(0, 100) + "..."
      : bio;
    setBio(abbrevDescription);
    otherUserEntered && fetchData(otherUserEntered.avatarUrl);
  }, []);

  
  
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
    <View paddingLeft="$5" paddingRight="$5" borderBottomColor='#808080'>
                <XStack space="$2" alignItems="center">
                  {avatarUrl && (
                    <Image
                      source={{ uri: avatarUrl, width: 60, height: 60 }}
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                      accessibilityLabel="Avatar"
                    />
                  )}
                  <Paragraph fontSize={20} >@{username}</Paragraph>
            <View style={{ objectPosition: "absolute" }}>
              <Button
                icon={ArrowRightSquare}
                style={{ backgroundColor: "#ff7403" }}
                onPress={()=>{
                  //setOtherUser(otherUserEntered);
                  navigation.navigate("OtherProfile");
                }}
              >
              </Button>
            </View>
                </XStack>
            <View>
              <H5>{bio ? bio : ''}</H5>
            </View>
    </View>
  );
}
// Should i have something that cuts short extended bios? 