import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { ScrollView, View, Alert, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { Session } from "@supabase/supabase-js";
import Avatar from "./Avatar";

export default function Profile({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [bio, setBio] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error("No user on the session!");

            const { data, error, status } = await supabase
                .from("profiles")
                .select(`username, display_name, bio, avatar_url`)
                .eq("id", session?.user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setDisplayName(data.display_name);
                setBio(data.bio);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView className="p-12 mt-0">
            <View className="mt-20 items-center">
                <Avatar
                    url={avatarUrl}
                    onUpload={() => {}}
                    allowUpload={false}
                />
            </View>

            <View className="mt-10 py-4 self-stretch">
                <Text className="text-2xl text-center">
                    {displayName ? displayName : "No display name"}
                </Text>
            </View>
            <View className="py-2 self-stretch">
                <Text className="text-xl text-center">@{username}</Text>
            </View>

            <View className="py-4 self-stretch">
                <Text className="text-lg">{bio ? bio : "No bio yet"}</Text>
            </View>

            <View className="py-4 self-stretch">
                <Button
                    title="Sign Out"
                    onPress={() => supabase.auth.signOut()}
                />
            </View>
        </ScrollView>
    );
}
