import { useState, useEffect } from "react";
//import { supabase } from "../../lib/supabase";
import { View, Avatar, Text } from "tamagui";
import { useStore } from "../../lib/store";
import { ThumbnailUser } from "../../lib/types";
import useQueryAvatars from "../../hooks/use-query-avatars";

export default function SmallAvatar({
  url,
  user,
}: {
  url: string | undefined;
  user: ThumbnailUser;
}) {
  const [avatarUrls] = useStore((state) => [state.avatarUrls]);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const { fetchAvatar } = useQueryAvatars();

  useEffect(() => {
    const getData = async () => {
      if (url) {
        await fetchAvatar(user.id, url);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    setAvatarUrl(
      avatarUrls.find((elem) => elem.userId === user.id)?.avatarUrl,
    );
  }, [avatarUrls]);

  return (
    <View style={{ alignItems: "center" }}>
      <Avatar circular size="$4">
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
    </View>
  );
}
