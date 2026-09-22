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
      users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          user_id: string
          name: string
          registration_number: string | null
          tax_id: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          registration_number?: string | null
          tax_id?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          registration_number?: string | null
          tax_id?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          company_id: string
          categories: string[]
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          categories?: string[]
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          categories?: string[]
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      supplier_verifications: {
        Row: {
          id: string
          supplier_id: string
          level: number
          verified_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier_id: string
          level?: number
          verified_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          level?: number
          verified_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      buy_requests: {
        Row: {
          id: string
          buyer_id: string
          title: string
          description: string
          category: string
          quantity: number
          unit: string
          budget: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          title: string
          description: string
          category: string
          quantity: number
          unit: string
          budget?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string
          title?: string
          description?: string
          category?: string
          quantity?: number
          unit?: string
          budget?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          request_id: string
          supplier_id: string
          price: number
          currency: string
          lead_time_days: number
          valid_until: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          request_id: string
          supplier_id: string
          price: number
          currency?: string
          lead_time_days: number
          valid_until: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          supplier_id?: string
          price?: number
          currency?: string
          lead_time_days?: number
          valid_until?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          quote_id: string
          buyer_id: string
          supplier_id: string
          total_amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote_id: string
          buyer_id: string
          supplier_id: string
          total_amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote_id?: string
          buyer_id?: string
          supplier_id?: string
          total_amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_stages: {
        Row: {
          id: string
          order_id: string
          stage: number
          status: string
          notes: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          stage: number
          status?: string
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          stage?: number
          status?: string
          notes?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspection_reports: {
        Row: {
          id: string
          order_id: string
          inspector_id: string | null
          result: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          inspector_id?: string | null
          result: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          inspector_id?: string | null
          result?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          order_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          reviewer_id: string
          reviewee_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          reviewer_id?: string
          reviewee_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      disputes: {
        Row: {
          id: string
          order_id: string
          initiator_id: string
          type: string
          description: string
          status: string
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          initiator_id: string
          type: string
          description: string
          status?: string
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          initiator_id?: string
          type?: string
          description?: string
          status?: string
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          reference_id: string
          reference_type: string
          type: string
          file_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference_id: string
          reference_type: string
          type: string
          file_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference_id?: string
          reference_type?: string
          type?: string
          file_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          amount: number
          currency: string
          status: string
          provider_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          amount: number
          currency?: string
          status?: string
          provider_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          amount?: number
          currency?: string
          status?: string
          provider_reference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          read: boolean
          data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          read?: boolean
          data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          read?: boolean
          data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
