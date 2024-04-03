import { ThumbnailUser } from "../../lib/types";
import {
  Button,
  Image,
  View,
  Paragraph,
  XStack,
  YStack,
} from "tamagui";
import { useEffect, useState } from "react";
import { ArrowRightSquare } from "@tamagui/lucide-icons";
import useQueryUsers from "../../hooks/use-query-users";

export default function OtherUserThumbnail({
  navigation,
  otherUserEntered,
}: {
  navigation: any;
  otherUserEntered: ThumbnailUser;
}) {
  const { getOtherProfile } = useQueryUsers();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [biography, setBio] = useState<string>('');

  useEffect(() => {
    setUsername(otherUserEntered ? otherUserEntered.username : null);
    setDisplayName(otherUserEntered ? otherUserEntered.displayName : null);
    setBio(otherUserEntered ? otherUserEntered.bio : '');
    otherUserEntered && setAvatarUrl(otherUserEntered.avatarUrl);
  }, []);

  const abbrevDescription =
    biography.length > 85
      ? biography.substring(0, 85) + "..."
      : biography;

  return (
    <View style={{ paddingLeft: 3, paddingRight: 5, borderBottomWidth: 1, borderColor: '#014cc6' }}>
                <XStack space="$2" alignItems="center" paddingTop={5}>
                  {avatarUrl && (
                    <Image
                      source={{ uri: avatarUrl, width: 60, height: 60 }}
                      style={{ width: 60, height: 60, borderRadius: 30 }}
                      accessibilityLabel="Avatar"
                    />
                  )}
                  <YStack>
                  {displayName ? <Paragraph fontSize={20} >{displayName}</Paragraph> : <Paragraph fontSize={20} >{username}</Paragraph>}
                  <Paragraph fontSize={14} color={'gray'}>@{username}</Paragraph>
                  </YStack>
                  
                  <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
          <Button
          icon={<ArrowRightSquare />}
          style={{ backgroundColor: '#ff7403', width: 40, height: 40, borderRadius: 20 }}
          onPress={() => {
            getOtherProfile(otherUserEntered.id);
            navigation.navigate('OtherProfileView');
          }}
          />
          </View>
          </XStack>
          <View padding={5}>
              <Paragraph fontSize={15}>{abbrevDescription}</Paragraph>
          </View>
    </View>
  );
}
 