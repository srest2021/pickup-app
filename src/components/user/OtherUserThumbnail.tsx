import { ThumbnailUser } from "../../lib/types";
import {
  Button,
  XStack,
  ListItem,
} from "tamagui";
import { Check, ChevronRight, X, Loader } from "@tamagui/lucide-icons";
import SmallAvatar from "./SmallAvatar";
import useMutationUser from "../../hooks/use-mutation-user";
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
  const [clicked, setClicked] = useState(false); // thumbnail-specific loader for buttons

  const avatarUrl =
    user.avatarUrl && user.avatarUrl.length > 0 ? user.avatarUrl : undefined;

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
        {user.bio && user.bio.trim().length > 0 && user.bio.trim()}
      </ListItem>

      {!isSearch && isFriend ? (
        <Button
          alignSelf="center"
          icon={clicked ? Loader : <X size="$1"/>}
          width={40}
          testID="remove-button"
          size="$3"
          disabled={clicked}
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
              icon={clicked ? Loader : <Check size="$1"/>}
              testID="accept-button"
              width={40}
              size="$3"
              alignSelf="center"
              disabled={clicked}
              style={{
                backgroundColor: "#05a579",
                color: "white",
              }}
              onPress={() => handleAccept()}
            />
            <Button
              icon={clicked ? Loader : <X size="$1"/>}
              testID="reject-button"
              width={40}
              size="$3"
              alignSelf="center"
              disabled={clicked}
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
