export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          created_at: string | null
          email: string
          facebook_url: string | null
          id: string
          image: string | null
          instagram_url: string | null
          linkedin_url: string | null
          name: string | null
          token: string | null
          twitter_url: string | null
          update_at: string | null
          user_id: string | null
          user_type: string | null
          youtube_url: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          facebook_url?: string | null
          id: string
          image?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string | null
          token?: string | null
          twitter_url?: string | null
          update_at?: string | null
          user_id?: string | null
          user_type?: string | null
          youtube_url?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          facebook_url?: string | null
          id?: string
          image?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          name?: string | null
          token?: string | null
          twitter_url?: string | null
          update_at?: string | null
          user_id?: string | null
          user_type?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authors_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          author: string
          created_at: string | null
          entry: Json
          first_paragraph: string
          id: string
          image: string | null
          title: string
        }
        Insert: {
          author: string
          created_at?: string | null
          entry: Json
          first_paragraph: string
          id?: string
          image?: string | null
          title: string
        }
        Update: {
          author?: string
          created_at?: string | null
          entry?: Json
          first_paragraph?: string
          id?: string
          image?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_fkey"
            columns: ["author"]
            referencedRelation: "authors"
            referencedColumns: ["id"]
          }
        ]
      }
      spotlight: {
        Row: {
          blurb: string
          created_at: string | null
          facebook: string | null
          github: string | null
          id: string
          instagram: string | null
          linkedin: string | null
          name: string
          photo: string | null
          portfolio: string
          twitter: string | null
          youtube: string | null
        }
        Insert: {
          blurb: string
          created_at?: string | null
          facebook?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          name: string
          photo?: string | null
          portfolio: string
          twitter?: string | null
          youtube?: string | null
        }
        Update: {
          blurb?: string
          created_at?: string | null
          facebook?: string | null
          github?: string | null
          id?: string
          instagram?: string | null
          linkedin?: string | null
          name?: string
          photo?: string | null
          portfolio?: string
          twitter?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          id: string
          image: string | null
          name: string
          testimonial: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image?: string | null
          name: string
          testimonial: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image?: string | null
          name?: string
          testimonial?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
