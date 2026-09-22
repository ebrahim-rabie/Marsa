export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          name_ar: string | null;
          type: 'buyer' | 'supplier_eg' | 'supplier_cn' | 'partner';
          country: string | null;
          city: string | null;
          phone: string | null;
          whatsapp: string | null;
          commercial_reg: string | null;
          tax_card: string | null;
          industrial_reg: string | null;
          business_license: string | null;
          website: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_ar?: string | null;
          type: 'buyer' | 'supplier_eg' | 'supplier_cn' | 'partner';
          country?: string | null;
          city?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          commercial_reg?: string | null;
          tax_card?: string | null;
          industrial_reg?: string | null;
          business_license?: string | null;
          website?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_ar?: string | null;
          type?: 'buyer' | 'supplier_eg' | 'supplier_cn' | 'partner';
          country?: string | null;
          city?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          commercial_reg?: string | null;
          tax_card?: string | null;
          industrial_reg?: string | null;
          business_license?: string | null;
          website?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          full_name: string;
          full_name_ar: string | null;
          role: 'buyer' | 'supplier' | 'admin' | 'agent';
          avatar_url: string | null;
          locale: string | null;
          company_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          phone?: string | null;
          full_name: string;
          full_name_ar?: string | null;
          role: 'buyer' | 'supplier' | 'admin' | 'agent';
          avatar_url?: string | null;
          locale?: string | null;
          company_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          full_name?: string;
          full_name_ar?: string | null;
          role?: 'buyer' | 'supplier' | 'admin' | 'agent';
          avatar_url?: string | null;
          locale?: string | null;
          company_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      suppliers: {
        Row: {
          id: string;
          company_id: string;
          categories: string[] | null;
          verification_level: number;
          is_middleman: boolean;
          verified_at: string | null;
          total_deals: number;
          avg_rating: number;
          profile_bio: string | null;
          profile_bio_ar: string | null;
          min_order_value: number | null;
          lead_time_days: number | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          categories?: string[] | null;
          verification_level?: number;
          is_middleman?: boolean;
          verified_at?: string | null;
          total_deals?: number;
          avg_rating?: number;
          profile_bio?: string | null;
          profile_bio_ar?: string | null;
          min_order_value?: number | null;
          lead_time_days?: number | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          categories?: string[] | null;
          verification_level?: number;
          is_middleman?: boolean;
          verified_at?: string | null;
          total_deals?: number;
          avg_rating?: number;
          profile_bio?: string | null;
          profile_bio_ar?: string | null;
          min_order_value?: number | null;
          lead_time_days?: number | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      supplier_verifications: {
        Row: {
          id: string;
          supplier_id: string;
          level: number;
          method: 'documents' | 'video_call' | 'on_site_audit';
          verified_by: string | null;
          evidence_urls: string[] | null;
          notes: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          level: number;
          method: 'documents' | 'video_call' | 'on_site_audit';
          verified_by?: string | null;
          evidence_urls?: string[] | null;
          notes?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          level?: number;
          method?: 'documents' | 'video_call' | 'on_site_audit';
          verified_by?: string | null;
          evidence_urls?: string[] | null;
          notes?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      buy_requests: {
        Row: {
          id: string;
          request_number: string | null;
          buyer_id: string;
          company_id: string | null;
          product_name: string;
          product_name_ar: string | null;
          category: string | null;
          specifications: Json | null;
          quantity: number;
          unit: string | null;
          budget_min: number | null;
          budget_max: number | null;
          budget_currency: string | null;
          supplier_pref: 'egyptian' | 'chinese' | 'both' | null;
          delivery_date: string | null;
          status: 'pending' | 'sourcing' | 'quotes_ready' | 'buyer_reviewing' | 'accepted' | 'expired' | 'cancelled';
          notes: string | null;
          attachments: string[] | null;
          source: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_number?: string | null;
          buyer_id: string;
          company_id?: string | null;
          product_name: string;
          product_name_ar?: string | null;
          category?: string | null;
          specifications?: Json | null;
          quantity: number;
          unit?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          budget_currency?: string | null;
          supplier_pref?: 'egyptian' | 'chinese' | 'both' | null;
          delivery_date?: string | null;
          status?: 'pending' | 'sourcing' | 'quotes_ready' | 'buyer_reviewing' | 'accepted' | 'expired' | 'cancelled';
          notes?: string | null;
          attachments?: string[] | null;
          source?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_number?: string | null;
          buyer_id?: string;
          company_id?: string | null;
          product_name?: string;
          product_name_ar?: string | null;
          category?: string | null;
          specifications?: Json | null;
          quantity?: number;
          unit?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          budget_currency?: string | null;
          supplier_pref?: 'egyptian' | 'chinese' | 'both' | null;
          delivery_date?: string | null;
          status?: 'pending' | 'sourcing' | 'quotes_ready' | 'buyer_reviewing' | 'accepted' | 'expired' | 'cancelled';
          notes?: string | null;
          attachments?: string[] | null;
          source?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quotes: {
        Row: {
          id: string;
          buy_request_id: string;
          supplier_id: string;
          unit_price: number;
          currency: string;
          moq: number | null;
          total_price: number;
          lead_time_days: number | null;
          shipping_method: string | null;
          shipping_cost: number | null;
          estimated_customs: number | null;
          estimated_total: number | null;
          incoterm: string | null;
          payment_terms: string | null;
          sample_available: boolean;
          sample_cost: number | null;
          status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
          notes: string | null;
          attachments: string[] | null;
          submitted_by: string | null;
          valid_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buy_request_id: string;
          supplier_id: string;
          unit_price: number;
          currency: string;
          moq?: number | null;
          total_price: number;
          lead_time_days?: number | null;
          shipping_method?: string | null;
          shipping_cost?: number | null;
          estimated_customs?: number | null;
          estimated_total?: number | null;
          incoterm?: string | null;
          payment_terms?: string | null;
          sample_available?: boolean;
          sample_cost?: number | null;
          status?: 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
          notes?: string | null;
          attachments?: string[] | null;
          submitted_by?: string | null;
          valid_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buy_request_id?: string;
          supplier_id?: string;
          unit_price?: number;
          currency?: string;
          moq?: number | null;
          total_price?: number;
          lead_time_days?: number | null;
          shipping_method?: string | null;
          shipping_cost?: number | null;
          estimated_customs?: number | null;
          estimated_total?: number | null;
          incoterm?: string | null;
          payment_terms?: string | null;
          sample_available?: boolean;
          sample_cost?: number | null;
          status?: 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
          notes?: string | null;
          attachments?: string[] | null;
          submitted_by?: string | null;
          valid_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string | null;
          buy_request_id: string;
          quote_id: string;
          buyer_id: string;
          supplier_id: string;
          total_value: number;
          currency: string;
          commission_rate: number | null;
          commission_amount: number | null;
          inspection_fee: number | null;
          coordination_fee: number | null;
          current_stage: number;
          status: 'active' | 'completed' | 'disputed' | 'cancelled';
          deposit_amount: number | null;
          deposit_paid: boolean;
          balance_amount: number | null;
          balance_released: boolean;
          estimated_delivery: string | null;
          actual_delivery: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string | null;
          buy_request_id: string;
          quote_id: string;
          buyer_id: string;
          supplier_id: string;
          total_value: number;
          currency: string;
          commission_rate?: number | null;
          commission_amount?: number | null;
          inspection_fee?: number | null;
          coordination_fee?: number | null;
          current_stage?: number;
          status?: 'active' | 'completed' | 'disputed' | 'cancelled';
          deposit_amount?: number | null;
          deposit_paid?: boolean;
          balance_amount?: number | null;
          balance_released?: boolean;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string | null;
          buy_request_id?: string;
          quote_id?: string;
          buyer_id?: string;
          supplier_id?: string;
          total_value?: number;
          currency?: string;
          commission_rate?: number | null;
          commission_amount?: number | null;
          inspection_fee?: number | null;
          coordination_fee?: number | null;
          current_stage?: number;
          status?: 'active' | 'completed' | 'disputed' | 'cancelled';
          deposit_amount?: number | null;
          deposit_paid?: boolean;
          balance_amount?: number | null;
          balance_released?: boolean;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_stages: {
        Row: {
          id: string;
          order_id: string;
          stage: number;
          status: 'pending' | 'active' | 'completed' | 'skipped';
          started_at: string | null;
          completed_at: string | null;
          notes: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          stage: number;
          status?: 'pending' | 'active' | 'completed' | 'skipped';
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          stage?: number;
          status?: 'pending' | 'active' | 'completed' | 'skipped';
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inspection_reports: {
        Row: {
          id: string;
          order_id: string;
          inspector: string | null;
          inspection_date: string | null;
          result: 'passed' | 'failed' | 'conditional' | null;
          total_units: number | null;
          defective_units: number | null;
          photo_urls: string[] | null;
          report_url: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          inspector?: string | null;
          inspection_date?: string | null;
          result?: 'passed' | 'failed' | 'conditional' | null;
          total_units?: number | null;
          defective_units?: number | null;
          photo_urls?: string[] | null;
          report_url?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          inspector?: string | null;
          inspection_date?: string | null;
          result?: 'passed' | 'failed' | 'conditional' | null;
          total_units?: number | null;
          defective_units?: number | null;
          photo_urls?: string[] | null;
          report_url?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          order_id: string;
          reviewer_id: string;
          supplier_id: string;
          rating: number;
          quality_rating: number | null;
          communication_rating: number | null;
          delivery_rating: number | null;
          comment: string | null;
          comment_ar: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          reviewer_id: string;
          supplier_id: string;
          rating: number;
          quality_rating?: number | null;
          communication_rating?: number | null;
          delivery_rating?: number | null;
          comment?: string | null;
          comment_ar?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          reviewer_id?: string;
          supplier_id?: string;
          rating?: number;
          quality_rating?: number | null;
          communication_rating?: number | null;
          delivery_rating?: number | null;
          comment?: string | null;
          comment_ar?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      disputes: {
        Row: {
          id: string;
          order_id: string;
          raised_by: string;
          type: 'quality' | 'quantity' | 'delay' | 'wrong_item' | 'other' | null;
          description: string | null;
          evidence_urls: string[] | null;
          status: 'open' | 'investigating' | 'resolved' | 'escalated';
          resolution: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          raised_by: string;
          type?: 'quality' | 'quantity' | 'delay' | 'wrong_item' | 'other' | null;
          description?: string | null;
          evidence_urls?: string[] | null;
          status?: 'open' | 'investigating' | 'resolved' | 'escalated';
          resolution?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          raised_by?: string;
          type?: 'quality' | 'quantity' | 'delay' | 'wrong_item' | 'other' | null;
          description?: string | null;
          evidence_urls?: string[] | null;
          status?: 'open' | 'investigating' | 'resolved' | 'escalated';
          resolution?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          order_id: string | null;
          company_id: string | null;
          type:
            | 'contract'
            | 'invoice'
            | 'packing_list'
            | 'bill_of_lading'
            | 'acid_cert'
            | 'customs_form'
            | 'inspection_report'
            | 'commercial_reg'
            | 'tax_card'
            | 'business_license'
            | 'other';
          name: string;
          file_url: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          company_id?: string | null;
          type:
            | 'contract'
            | 'invoice'
            | 'packing_list'
            | 'bill_of_lading'
            | 'acid_cert'
            | 'customs_form'
            | 'inspection_report'
            | 'commercial_reg'
            | 'tax_card'
            | 'business_license'
            | 'other';
          name: string;
          file_url: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          company_id?: string | null;
          type?:
            | 'contract'
            | 'invoice'
            | 'packing_list'
            | 'bill_of_lading'
            | 'acid_cert'
            | 'customs_form'
            | 'inspection_report'
            | 'commercial_reg'
            | 'tax_card'
            | 'business_license'
            | 'other';
          name?: string;
          file_url?: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          type: 'deposit' | 'balance' | 'commission' | 'inspection_fee' | 'refund' | null;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          method: string | null;
          reference: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          type?: 'deposit' | 'balance' | 'commission' | 'inspection_fee' | 'refund' | null;
          amount: number;
          currency: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          method?: string | null;
          reference?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          type?: 'deposit' | 'balance' | 'commission' | 'inspection_fee' | 'refund' | null;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          method?: string | null;
          reference?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          title_ar: string | null;
          body: string | null;
          body_ar: string | null;
          link: string | null;
          read: boolean;
          channel: string | null;
          sent_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          title_ar?: string | null;
          body?: string | null;
          body_ar?: string | null;
          link?: string | null;
          read?: boolean;
          channel?: string | null;
          sent_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          title_ar?: string | null;
          body?: string | null;
          body_ar?: string | null;
          link?: string | null;
          read?: boolean;
          channel?: string | null;
          sent_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_company_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}

// Convenient Type Aliases for Rows
export type Company = Database['public']['Tables']['companies']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Supplier = Database['public']['Tables']['suppliers']['Row'];
export type SupplierVerification = Database['public']['Tables']['supplier_verifications']['Row'];
export type BuyRequest = Database['public']['Tables']['buy_requests']['Row'];
export type Quote = Database['public']['Tables']['quotes']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderStage = Database['public']['Tables']['order_stages']['Row'];
export type InspectionReport = Database['public']['Tables']['inspection_reports']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Dispute = Database['public']['Tables']['disputes']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
