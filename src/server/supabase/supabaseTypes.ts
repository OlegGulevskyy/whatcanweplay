export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      games: {
        Row: {
          additional_info: string | null
          created_at: string | null
          created_by: string | null
          how_to_play: string | null
          how_to_win: string | null
          id: string
          is_deleted: boolean
          is_published: boolean | null
          location: string | null
          purpose: string | null
          rules: string[] | null
          setup: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          additional_info?: string | null
          created_at?: string | null
          created_by?: string | null
          how_to_play?: string | null
          how_to_win?: string | null
          id?: string
          is_deleted?: boolean
          is_published?: boolean | null
          location?: string | null
          purpose?: string | null
          rules?: string[] | null
          setup?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_info?: string | null
          created_at?: string | null
          created_by?: string | null
          how_to_play?: string | null
          how_to_win?: string | null
          id?: string
          is_deleted?: boolean
          is_published?: boolean | null
          location?: string | null
          purpose?: string | null
          rules?: string[] | null
          setup?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          credits_available: number
          email: string | null
          full_name: string | null
          id: string
          is_premium: boolean
          language_preference: string | null
          stripe_customer_id: string | null
          subscription_status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          credits_available?: number
          email?: string | null
          full_name?: string | null
          id: string
          is_premium?: boolean
          language_preference?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          credits_available?: number
          email?: string | null
          full_name?: string | null
          id?: string
          is_premium?: boolean
          language_preference?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
        }
      }
      prompts: {
        Row: {
          amount_of_players: number | null
          created_at: string | null
          created_by: string | null
          custom_instructions: string | null
          duration: number | null
          game: string | null
          id: string
          location: string | null
          minimum_age: number | null
          props: string | null
          updated_at: string | null
        }
        Insert: {
          amount_of_players?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_instructions?: string | null
          duration?: number | null
          game?: string | null
          id?: string
          location?: string | null
          minimum_age?: number | null
          props?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_of_players?: number | null
          created_at?: string | null
          created_by?: string | null
          custom_instructions?: string | null
          duration?: number | null
          game?: string | null
          id?: string
          location?: string | null
          minimum_age?: number | null
          props?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrementby: {
        Args: {
          x: number
          user_email: string
        }
        Returns: undefined
      }
      incrementby: {
        Args: {
          x: number
          user_email: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

