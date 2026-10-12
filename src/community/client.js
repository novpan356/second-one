import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const backendConfigured = Boolean(url && key && /^https:\/\//.test(url));
export const client = backendConfigured ? createClient(url, key) : null;
export const playerApi = import.meta.env.VITE_PLAYER_API_URL || "";
export const publicKey = key;
