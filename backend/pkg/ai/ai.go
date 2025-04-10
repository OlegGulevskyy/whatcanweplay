package ai

import (
	"context"
	"encoding/json"

	"encore.app/config"
	openai "github.com/sashabaranov/go-openai"
	"github.com/sashabaranov/go-openai/jsonschema"
)

type GameGenerationResult struct {
	Title          string   `json:"title"`
	Purpose        string   `json:"purpose"`
	Setup          []string `json:"setup"`
	Rules          []string `json:"rules"`
	HowToWin       string   `json:"how_to_win"`
	HowToPlay      string   `json:"how_to_play"`
	AdditionalInfo string   `json:"additional_info"`
}

func GenerateText(ctx context.Context, prompt string) (*openai.ChatCompletionResponse, error) {
	client := openai.NewClient(config.GetAppSecrets().OPENAI_API_KEY)

	resp, err := client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			Tools: []openai.Tool{
				{
					Type: "function",
					Function: &openai.FunctionDefinition{
						Name: "game_generation",
						Parameters: jsonschema.Definition{
							Type: jsonschema.Object,
							Properties: map[string]jsonschema.Definition{
								"title": {
									Type:        jsonschema.String,
									Description: "The title of the game",
								},
								"purpose": {
									Type:        jsonschema.String,
									Description: "The purpose of the game",
								},
								"setup": {
									Type: jsonschema.Array,
									Items: &jsonschema.Definition{
										Type: jsonschema.String,
									},
									Description: "The setup of the game. Must provide!",
								},
								"rules": {
									Type: jsonschema.Array,
									Items: &jsonschema.Definition{
										Type: jsonschema.String,
									},
									Description: "The rules of the game",
								},
								"how_to_win": {
									Type:        jsonschema.String,
									Description: "How to win the game. Must provide!",
								},
								"how_to_play": {
									Type:        jsonschema.String,
									Description: "How to play the game. Must provide!",
								},
								"additional_info": {
									Type:        jsonschema.String,
									Description: "Additional info. Must provide!",
								},
							},
						},
					},
				},
			},
		},
	)

	if err != nil {
		return nil, err
	}

	return &resp, nil
}

func ParseGameGenerationResult(result *openai.ChatCompletionResponse) (*GameGenerationResult, error) {
	var gameGenerationResult GameGenerationResult
	fnArgs := result.Choices[0].Message.ToolCalls[0].Function.Arguments
	err := json.Unmarshal([]byte(fnArgs), &gameGenerationResult)
	if err != nil {
		return nil, err
	}

	return &gameGenerationResult, nil
}
