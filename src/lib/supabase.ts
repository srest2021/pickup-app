import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zjtlbrgdqcbazdasfuzk.supabase.co";
const supabaseAnonKey = process.env.ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error("No Supabase anon key in .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
