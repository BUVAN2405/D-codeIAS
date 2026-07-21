import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || "https://kdwwvpjejtueeoicmmyf.supabase.co";
const supabaseKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || "sb_publishable_41ZJAofpuxL_6mXz6ZpXTA_O_RHt5Js";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
