import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zjtlbrgdqcbazdasfuzk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdGxicmdkcWNiYXpkYXNmdXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTk1ODMsImV4cCI6MjAyMzA3NTU4M30.qP74GBXOUk5dFUvbzSC0hhDeAbu4o8VcdHVqRSCqY_I";//process.env.SUPABASE_ANON_KEY;

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
