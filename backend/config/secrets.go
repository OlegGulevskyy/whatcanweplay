package config

var secrets struct {
	SUPABASE_URL         string
	SUPABASE_ANON_KEY    string
	SUPABASE_SERVICE_KEY string
	OPENAI_API_KEY       string
}

type Secrets struct {
	SUPABASE_URL         string
	SUPABASE_ANON_KEY    string
	SUPABASE_SERVICE_KEY string
	OPENAI_API_KEY       string
}

func GetAppSecrets() Secrets {
	return secrets
}
