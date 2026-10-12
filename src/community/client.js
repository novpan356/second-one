import { createClient } from "@supabase/supabase-js";
export const backendUrl = (import.meta.env.VITE_SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "");
const url = backendUrl;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const backendConfigured = Boolean(url && key && /^https:\/\//.test(url));
export const client = backendConfigured ? createClient(url, key) : null;
export const playerApi = import.meta.env.VITE_PLAYER_API_URL || "";
export const publicKey = key;
