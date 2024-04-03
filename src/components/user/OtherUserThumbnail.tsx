import { ThumbnailUser } from "../../lib/types";
import {
  Button,
  View,
  Paragraph,
  XStack,
  YStack,
  Avatar,
  Text,
} from "tamagui";
import { ArrowRightSquare } from "@tamagui/lucide-icons";
import useQueryUsers from "../../hooks/use-query-users";

export default function OtherUserThumbnail({
  navigation,
  user: user,
}: {
  navigation: any;
  user: ThumbnailUser;
}) {
  const { getOtherProfile } = useQueryUsers();

  const avatarUrl =
    user.avatarUrl && user.avatarUrl.length > 0 ? user.avatarUrl : undefined;

  const abbrevBio =
    user.bio && user.bio.length > 85
      ? user.bio.substring(0, 85) + "..."
      : user.bio;

  return (
    <View style={{ borderBottomWidth: 1, borderColor: "#014cc6" }}>
      <XStack space="$2" alignItems="center" paddingTop={5}>
        <Avatar circular size="$3">
          <Avatar.Image accessibilityLabel={user.username} src={avatarUrl} />
          <Avatar.Fallback
            backgroundColor="#08348c"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="#ffffff">
              {user.username.substring(0, 2).toUpperCase()}
            </Text>
          </Avatar.Fallback>
        </Avatar>
        <YStack>
          <Paragraph fontSize={18}>
            {user.displayName ? user.displayName : user.username}
          </Paragraph>
          <Paragraph fontSize={14} color={"gray"}>
            @{user.username}
          </Paragraph>
        </YStack>

        <View
          style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}
        >
          <Button
            icon={<ArrowRightSquare />}
            style={{
              backgroundColor: "#ff7403",
              width: 40,
              height: 40,
              borderRadius: 20,
            }}
            onPress={() => {
              getOtherProfile(user.id);
              navigation.navigate("OtherProfileView");
            }}
          />
        </View>
      </XStack>
      <View padding={5}>
        <Paragraph fontSize={15}>{abbrevBio}</Paragraph>
      </View>
    </View>
  );
}
