import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export function createAnonymousClient(): SupabaseClient<
  Database,
  "public"
> | null {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error("Missing env variables for Supabase");
    }
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: { persistSession: false },
      }
    );
    return supabase;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("Error creating Supabase client");
      console.error(error);
    }
    return null;
  }
}
