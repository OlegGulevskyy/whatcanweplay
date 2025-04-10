package hello

import (
	"context"
	"fmt"

	"encore.app/config"
)

//encore:api public path=/hello/:name
func World(ctx context.Context, name string) (*Response, error) {
	msg := "Hello, " + name + "!"
	secrets := config.GetAppSecrets()

	fmt.Println("secret supabase url", secrets.SUPABASE_URL)
	fmt.Println("secret service key", secrets.SUPABASE_SERVICE_KEY)
	fmt.Println("secret anon key", secrets.SUPABASE_ANON_KEY)

	return &Response{Message: msg}, nil
}

type Response struct {
	Message string
}

// Next steps
//
// 1. Deploy your application to the cloud
//
//     git add -A .
//     git commit -m 'Commit message'
//     git push encore
//
// 2. To continue exploring Encore, check out one of these topics:
//
// 	  Defining APIs and Services:	 https://encore.dev/docs/primitives/services-and-apis
//    Using SQL databases:  		 https://encore.dev/docs/develop/databases
//    Authenticating users: 		 https://encore.dev/docs/develop/auth
//    Building a Slack bot: 		 https://encore.dev/docs/tutorials/slack-bot
//    Building a REST API:  		 https://encore.dev/docs/tutorials/rest-api
//	  Building an Event-Driven app:  https://encore.dev/docs/tutorials/uptime
