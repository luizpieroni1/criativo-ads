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
      creatives: {
        Row: {
          id: string
          user_id: string
          created_at: string
          format: string
          company_name: string
          form_data: Json
          result: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          format: string
          company_name: string
          form_data: Json
          result: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          format?: string
          company_name?: string
          form_data?: Json
          result?: string
        }
      }
    }
  }
}
