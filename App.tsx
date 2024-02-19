import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./src/lib/supabase";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import "./global.css";
import EditProfile from "./src/components/EditProfile";
import Profile from "./src/components/Profile";
import Login from "./src/components/Login";
import Register from "./src/components/Register";

export default function App() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <View>
            {session && session.user ? (
                <Profile key={session.user.id} session={session} />
            ) : (
                <Login />
            )}
        </View>
    );
}
