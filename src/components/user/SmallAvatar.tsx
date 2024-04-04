import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { View, Alert, Image, Text } from "react-native";
import { Button } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { Camera, Plus } from "@tamagui/lucide-icons";

interface Props {
  url: string | null;
  onUpload: (filePath: string) => void;
  allowUpload: boolean;
}

export default function SmallAvatar({ url, onUpload, allowUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
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

  //className="object-cover max-w-full pt-0 overflow-hidden rounded-full h-36 w-36"
  //className="max-w-full overflow-hidden border-2 border-solid rounded-full h-36 w-36 border-slate-300 bg-slate-200"
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: 60,
          height: 60,
          overflow: "hidden",
          borderRadius: 60,
          borderWidth: 1,
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