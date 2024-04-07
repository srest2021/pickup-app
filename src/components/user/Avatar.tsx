import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { View, Alert, Image, Text } from "react-native";
import { Button } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { Camera, Plus } from "@tamagui/lucide-icons";
import useQueryAvatars from "../../hooks/use-query-avatars";
import { useStore } from "../../lib/store";
import { User, OtherUser } from "../../lib/types";

interface Props {
  url: string | null;
  user: User | OtherUser;
  onUpload: (filePath: string) => void;
  allowUpload: boolean;
}

export default function Avatar({ url, user, onUpload, allowUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [avatarUrls] = useStore((state) => [state.avatarUrls]);
  const { fetchAvatar } = useQueryAvatars();

  useEffect(() => {
    const getData = async () => {
      if (url) {
        await fetchAvatar(user.id, url);
      }
    };
    getData();
  }, [url]);

  useEffect(() => {
    setAvatarUrl(avatarUrls.find((elem) => elem.userId === user.id)?.avatarUrl);
  }, [avatarUrls]);

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const image = result.assets[0];

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer(),
      );

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: 170,
          height: 170,
          overflow: "hidden",
          borderRadius: 150,
          borderWidth: 2,
          borderColor: "darkgrey",
          backgroundColor: "#d3d4d3",
        }}
      >
        {avatarUrl === null ? (
          <View
            style={{
              flex: 1,
              backgroundColor: "bg-slate-200",
              borderRadius: 150,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "grey" }}>Loading...</Text>
          </View>
        ) : (
          <Image
            source={{ uri: avatarUrl }}
            accessibilityLabel="Avatar"
            style={{ flex: 1, width: null, height: null, borderRadius: 150 }}
          />
        )}
      </View>

      {allowUpload && (
        <View style={{ marginTop: 10 }}>
          <Button
            icon={Camera}
            onPress={uploadAvatar}
            disabled={uploading}
            backgroundColor="#d3d4d3"
            variant="outlined"
          >
            {uploading ? "Uploading ..." : "Upload"}
          </Button>
        </View>
      )}
    </View>
  );
}
