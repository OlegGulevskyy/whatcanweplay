// To not write stuff like Database["public"]["users"] etc everywhere
// Just some wrappers for prettifying

import { type Database } from "~/server/supabase/supabaseTypes";

export type TGame = Database["public"]["Tables"]["games"]["Row"];
export type TProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type TPrompt = Database["public"]["Tables"]["prompts"]["Row"];
