/*
* This service receives request to genereate a game which is a 3 step procedure:
1. Generate a Database entry with UUID and a status "pending" or similar. Reply back to the caller
with generated data (at least UUID) to not block the caller.
2. Generate the game by calling LLM service, using funcion calling
3. Update the database entry with the rules of the game and it's status (i.e. "generated" or "failed")
*/
package games

import (
	"context"
	"fmt"

	"encore.app/config"
	"encore.app/pkg/ai"
	"encore.dev/pubsub"
	"github.com/supabase-community/supabase-go"
)

type GenerationEvent struct {
	GameId string `pubsub-attr:"game_id"`
	UserId string `pubsub-attr:"user_id"`
	Prompt string `pubsub-attr:"prompt"`
	Status string `pubsub-attr:"status"`
}

var Generations = pubsub.NewTopic[*GenerationEvent]("generations", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

type GenerateGameParams struct {
	UserId     string `json:"userId"`
	GameId     string `json:"gameId"`
	GamePrompt string `json:"gamePrompt"`
}

var _ = pubsub.NewSubscription(
	Generations, "generations",
	pubsub.SubscriptionConfig[*GenerationEvent]{
		Handler: GenerateGameWithAi,
	},
)

func GenerateGameWithAi(ctx context.Context, event *GenerationEvent) error {
	fmt.Println("Generating game for user from pubsub event: ", event.GameId)
	fmt.Println("Using prompt:", event.Prompt)
	fmt.Println("UserId:", event.UserId)

	err := generateGame(ctx, &GenerateGameParams{
		UserId:     event.UserId,
		GameId:     event.GameId,
		GamePrompt: event.Prompt,
	})

	if err != nil {
		fmt.Println("Error generating game:", err)
		return err
	}

	fmt.Println("Successfully completed game generation!")
	return nil
}

func generateGame(ctx context.Context, params *GenerateGameParams) error {
	secrets := config.GetAppSecrets()
	client, err := supabase.NewClient(secrets.SUPABASE_URL, secrets.SUPABASE_SERVICE_KEY, nil)
	if err != nil {
		// TODO: handle error, update DB
		return err
	}

	resp, err := ai.GenerateText(ctx, params.GamePrompt)

	gameGenerationResult, err := ai.ParseGameGenerationResult(resp)
	if err != nil {
		// TODO: handle error, update DB
		return nil
	}

	client.From("games").Update(map[string]interface{}{
		"title":           gameGenerationResult.Title,   // yes
		"purpose":         gameGenerationResult.Purpose, // yes
		"setup":           gameGenerationResult.Setup,
		"rules":           gameGenerationResult.Rules,
		"how_to_win":      gameGenerationResult.HowToWin,
		"how_to_play":     gameGenerationResult.HowToPlay,
		"additional_info": gameGenerationResult.AdditionalInfo,
		"gen_status":      "success",
	}, "", "").Eq("id", params.GameId).Execute()

	return nil
}

type Response struct {
	Ok bool `json:"ok"`
}

//encore:api public path=/games/generate
func Generate(ctx context.Context, params *GenerateGameParams) (*Response, error) {
	Generations.Publish(ctx, &GenerationEvent{
		GameId: params.GameId,
		Prompt: params.GamePrompt,
		UserId: params.UserId,
		Status: "pending",
	})

	fmt.Println("Successfully requested game generation!")

	return &Response{}, nil
}
