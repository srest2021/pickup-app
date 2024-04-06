import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";

function useQueryAvatars() {
  const [avatarUrls, addAvatarUrl] = useStore((state) => [
    state.avatarUrls,
    state.addAvatarUrl,
  ]);

  async function fetchAvatar(
    userId: string,
    avatarPath: string,
  ) {
    if (avatarPath) {
      const avatarUrlAlreadyExists = avatarUrls.find(
        (elem) => elem.userId === userId,
      );
      if (avatarUrlAlreadyExists) {
        return;
      }
      try {
        await downloadImage(userId, avatarPath);
      } catch (error) {
        addAvatarUrl(userId, null);
      }
    }
  }

  async function downloadImage(userId: string, path: string) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) throw error;

    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      addAvatarUrl(userId, fr.result as string);
      //return fr.result as string;
    };
    //return undefined;
  }

  return { fetchAvatar };
}

export default useQueryAvatars;
