import { z } from "zod";

export const GenerateGameSchema = z.object({
  location: z.string().min(3).max(30),
  amountOfPlayers: z.coerce.number().int().min(1).max(10),
  duration: z.coerce.number().int().min(1).max(60),
  minimumAge: z.coerce.number().int().min(1).max(100),
  customInstructions: z.string().max(50).optional(),
  props: z.string().max(30).optional(),
});
