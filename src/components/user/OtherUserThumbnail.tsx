import { ThumbnailUser } from "../../lib/types";
import {
  Button,
  View,
  Paragraph,
  XStack,
  YStack,
  Separator,
  Text,
  YGroup,
  ListItem,
} from "tamagui";
import { Check, ChevronRight, X, Loader } from "@tamagui/lucide-icons";
import useQueryUsers from "../../hooks/use-query-users";
import SmallAvatar from "./SmallAvatar";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";
import { useState } from "react";

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
  const [loading] = useStore((state) => [state.loading]); // disable buttons on loading
  const [clicked, setClicked] = useState(false); // thumbnail-specific loader for buttons

  const avatarUrl =
    user.avatarUrl && user.avatarUrl.length > 0 ? user.avatarUrl : undefined;

  // don't need this anymore because ListItem trims it for us!
  // const abbrevBio =
  //   user.bio && user.bio.trim().length > 85
  //     ? user.bio.substring(0, 85).trim() + "..."
  //     : user.bio;

  const { removeFriendById } = useMutationUser();
  const { acceptFriendRequestById } = useMutationUser();
  const { rejectFriendRequestById } = useMutationUser();

  const handleRemove = async () => {
    setClicked(true);
    await removeFriendById(user.id);
    setClicked(false);
  };

  const handleAccept = async () => {
    setClicked(true);
    await acceptFriendRequestById(user.id);
    setClicked(false);
  };

  const handleReject = async () => {
    setClicked(true);
    await rejectFriendRequestById(user.id);
    setClicked(false);
  };

  return (
    <XStack flex={1} space="$3">
      <ListItem
        hoverTheme
        pressTheme
        flex={1}
        borderRadius={20}
        icon={<SmallAvatar url={avatarUrl} user={user} />}
        title={user.displayName ? user.displayName : user.username}
        subTitle={`@${user.username}`}
        iconAfter={ChevronRight}
        onPress={() => {
          navigation.navigate("OtherProfileView", { userId: user.id });
        }}
      >
        {user.bio && user.bio.trim().length > 0 && user.bio}
      </ListItem>

      {!isSearch && isFriend ? (
        <Button
          alignSelf="center"
          icon={clicked ? Loader : X}
          testID="remove-button"
          size="$3"
          disabled={loading}
          style={{
            backgroundColor: "#e90d52",
            color: "white",
          }}
          onPress={() => handleRemove()}
        />
      ) : (
        !isSearch && (
          <XStack space="$2" alignSelf="center">
            <Button
              icon={clicked ? Loader : Check}
              testID="accept-button"
              size="$3"
              alignSelf="center"
              disabled={loading}
              style={{
                backgroundColor: "#05a579",
                color: "white",
              }}
              onPress={() => handleAccept()}
            />
            <Button
              icon={clicked ? Loader : X}
              testID="reject-button"
              size="$3"
              alignSelf="center"
              disabled={loading}
              style={{
                backgroundColor: "#e90d52",
                color: "white",
              }}
              onPress={() => handleReject()}
            />
          </XStack>
        )
      )}
    </XStack>
  );
}
