import { ThumbnailUser } from "../../lib/types";
import { Button, View, Paragraph, XStack, YStack } from "tamagui";
import { ArrowRightSquare, Check, X } from "@tamagui/lucide-icons";
import useQueryUsers from "../../hooks/use-query-users";
import SmallAvatar from "./SmallAvatar";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";

export default function OtherUserThumbnail({
  navigation,
  user: user,
  isFriend,
  isSearch,
}: {
  navigation: any;
  user: ThumbnailUser;
  isFriend: boolean;
  isSearch: boolean;
}) {
  const [loading] = useStore((state) => [state.loading]);
  const { getOtherProfile } = useQueryUsers();

  const avatarUrl =
    user.avatarUrl && user.avatarUrl.length > 0 ? user.avatarUrl : undefined;

  const abbrevBio =
    user.bio && user.bio.trim().length > 85
      ? user.bio.substring(0, 85).trim() + "..."
      : user.bio;

  const { removeFriendById } = useMutationUser();
  const { acceptFriendRequestById } = useMutationUser();

  const handleRemove = async () => {
    await removeFriendById(user.id);
  };

  const handleAccept = async () => {
    await acceptFriendRequestById(user.id);
  };

  return (
    <View
      style={{
        paddingLeft: 3,
        paddingRight: 5,
        borderBottomWidth: 1,
        borderColor: "#014cc6",
      }}
    >
      <XStack space="$2" alignItems="center" paddingTop={20}>
        <SmallAvatar url={avatarUrl} user={user} />
        <YStack>
          <Paragraph fontSize={18}>
            {user.displayName ? user.displayName : user.username}
          </Paragraph>
          <Paragraph fontSize={14} color={"gray"}>
            @{user.username}
          </Paragraph>
        </YStack>

        <XStack space="$3" style={{ flex: 1, justifyContent: "flex-end" }}>
          {!isSearch && isFriend ? (
            <Button
              icon={X}
              testID="remove-button"
              size="$5"
              disabled={loading}
              style={{
                backgroundColor: "#e90d52",
                color: "white",
                width: 50,
                height: 50,
              }}
              onPress={() => handleRemove()}
            />
          ) : (
            !isSearch && (
              <Button
                icon={Check}
                testID="accept-button"
                size="$5"
                disabled={loading}
                style={{
                  backgroundColor: "#05a579",
                  color: "white",
                  width: 50,
                  height: 50,
                }}
                onPress={() => handleAccept()}
              />
            )
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
