import { z } from "zod";
import { GenerateGameSchema } from "~/components/play/form-schema";

export const getGenerateGamePrompt = ({
  location,
  amountOfPlayers,
  minimumAge,
  duration,
  props,
  customInstructions,
}: z.infer<typeof GenerateGameSchema>) => {
  let prompt = `Generate a game for ${amountOfPlayers} players that is ${duration} minutes long. Design the game be played in a ${location}.`;

  if (minimumAge) {
    prompt += ` The game should be suitable for players over the age of ${minimumAge}.`;
  }

  if (props) {
    prompt += ` The game should include the following props: ${props}.`;
  }

  if (customInstructions) {
    prompt += ` ${customInstructions}`;
  }

  return prompt;
};
