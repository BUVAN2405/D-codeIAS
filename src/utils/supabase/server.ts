import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://kdwwvpjejtueeoicmmyf.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_41ZJAofpuxL_6mXz6ZpXTA_O_RHt5Js";

export const createClient = (cookieStore?: any) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll ? cookieStore.getAll() : []
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore?.set?.(name, value, options))
          } catch {
            // Ignored if called from server component or unsupported environment
          }
        },
      },
    },
  );
};
