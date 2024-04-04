import { ThumbnailUser } from "../../lib/types";
import { Button, View, Paragraph, XStack, YStack, Avatar, Text } from "tamagui";
import { ArrowRightSquare, X } from "@tamagui/lucide-icons";
import useQueryUsers from "../../hooks/use-query-users";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import SmallAvatar from "./SmallAvatar";
import useMutationGame from "../../hooks/use-mutation-game";
import useMutationUser from "../../hooks/use-mutation-user";

export default function OtherUserThumbnail({
  navigation,
  user: user,
  isFriend,
}: {
  navigation: any;
  user: ThumbnailUser;
  isFriend: boolean;
}) {
  const { getOtherProfile } = useQueryUsers();
  const [url, setAvatarUrl] = useState<string | null>(null);

  const avatarUrl =
    user.avatarUrl && user.avatarUrl.length > 0 ? user.avatarUrl : undefined;

    useEffect(() => {
      if (url) downloadImage(url);
    }, [url]);
  
    async function downloadImage(path: string) {
      console.log("hi")
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
  
        if (error) {
          throw error;
        }
  
        const fr = new FileReader();
        fr.readAsDataURL(data);
        fr.onload = () => {
          setAvatarUrl(fr.result as string);
        };
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error downloading image: ", error.message);
        }
      }
    }

  const abbrevBio =
    user.bio && user.bio.trim().length > 85
      ? user.bio.substring(0, 85).trim() + "..."
      : user.bio;

  const { removeFriendById } = useMutationUser();

  const handleRemove = async () => {
    await removeFriendById(user.id);
  };

  return (
    <View style={{ paddingLeft:3, paddingRight:5, borderBottomWidth: 1, borderColor: "#014cc6" }}>
      <XStack space="$2" alignItems="center" paddingTop={20}>
          <SmallAvatar
            url={user.avatarUrl}
            onUpload={() => {}}
            allowUpload={false}
          />
        <YStack>
          <Paragraph fontSize={18}>
            {user.displayName ? user.displayName : user.username}
          </Paragraph>
          <Paragraph fontSize={14} color={"gray"}>
            @{user.username}
          </Paragraph>
        </YStack>


        <XStack space="$3" style={{ flex: 1, justifyContent: "flex-end"}}>
          {isFriend && (
            <Button
              icon={X}
              testID="remove-button"
              size="$5"
              style={{ backgroundColor: "#e90d52", color: "white", width: 50, height: 50 }}
              onPress={() => handleRemove()}
            />
          )}
          
          <Button
            icon={<ArrowRightSquare />}
            style={{
              backgroundColor: "#ff7403",
              width: 50,
              height: 50,
              borderRadius: 50,
            }}
            onPress={() => {
              getOtherProfile(user.id);
              navigation.navigate("OtherProfileView");
            }}
          />
          
        </XStack>
    
        
      </XStack>
      <View padding={5}>
        <Paragraph fontSize={15}>
          {abbrevBio ? abbrevBio.trim() : null}
        </Paragraph>
      </View>
    </View>
  );
}