export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CompanyType = 'buyer' | 'supplier_eg' | 'supplier_cn' | 'partner';
export type UserRole = 'buyer' | 'supplier' | 'admin' | 'agent';
export type VerificationMethod = 'documents' | 'video_call' | 'on_site_audit';
export type SupplierPreference = 'egyptian' | 'chinese' | 'both';
export type BuyRequestStatus =
  | 'pending'
  | 'sourcing'
  | 'quotes_ready'
  | 'buyer_reviewing'
  | 'accepted'
  | 'expired'
  | 'cancelled';
export type QuoteStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
export type OrderStatus = 'active' | 'completed' | 'disputed' | 'cancelled';
export type OrderStageStatus = 'pending' | 'active' | 'completed' | 'skipped';
export type CustomsStatus =
  | 'acid_issued'
  | 'in_transit'
  | 'arrived_port'
  | 'under_inspection'
  | 'cleared';
export type InspectionResult = 'passed' | 'failed' | 'conditional';
export type DisputeType = 'quality' | 'quantity' | 'delay' | 'wrong_item' | 'other';
export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'escalated';
export type PaymentType =
  | 'deposit'
  | 'balance'
  | 'commission'
  | 'inspection_fee'
  | 'refund';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type DocumentType =
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

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          name_ar: string | null;
          type: CompanyType;
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
          type: CompanyType;
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
          type?: CompanyType;
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
          role: UserRole;
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
          role?: UserRole;
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
          role?: UserRole;
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
          factory_address: string | null;
          factory_address_zh: string | null;
          production_capacity: string | null;
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
          factory_address?: string | null;
          factory_address_zh?: string | null;
          production_capacity?: string | null;
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
          factory_address?: string | null;
          factory_address_zh?: string | null;
          production_capacity?: string | null;
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
          method: VerificationMethod;
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
          method: VerificationMethod;
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
          method?: VerificationMethod;
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
          supplier_pref: SupplierPreference | null;
          delivery_date: string | null;
          status: BuyRequestStatus;
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
          supplier_pref?: SupplierPreference | null;
          delivery_date?: string | null;
          status?: BuyRequestStatus;
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
          supplier_pref?: SupplierPreference | null;
          delivery_date?: string | null;
          status?: BuyRequestStatus;
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
          status: QuoteStatus;
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
          currency?: string;
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
          status?: QuoteStatus;
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
          status?: QuoteStatus;
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
          status: OrderStatus;
          deposit_amount: number | null;
          deposit_paid: boolean;
          balance_amount: number | null;
          balance_released: boolean;
          estimated_delivery: string | null;
          actual_delivery: string | null;
          acid_number: string | null;
          port_of_entry: string | null;
          bl_number: string | null;
          shipping_carrier: string | null;
          customs_status: CustomsStatus;
          fx_rates_snapshot: Json | null;
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
          currency?: string;
          commission_rate?: number | null;
          commission_amount?: number | null;
          inspection_fee?: number | null;
          coordination_fee?: number | null;
          current_stage?: number;
          status?: OrderStatus;
          deposit_amount?: number | null;
          deposit_paid?: boolean;
          balance_amount?: number | null;
          balance_released?: boolean;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          acid_number?: string | null;
          port_of_entry?: string | null;
          bl_number?: string | null;
          shipping_carrier?: string | null;
          customs_status?: CustomsStatus;
          fx_rates_snapshot?: Json | null;
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
          status?: OrderStatus;
          deposit_amount?: number | null;
          deposit_paid?: boolean;
          balance_amount?: number | null;
          balance_released?: boolean;
          estimated_delivery?: string | null;
          actual_delivery?: string | null;
          acid_number?: string | null;
          port_of_entry?: string | null;
          bl_number?: string | null;
          shipping_carrier?: string | null;
          customs_status?: CustomsStatus;
          fx_rates_snapshot?: Json | null;
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
          status: OrderStageStatus;
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
          status?: OrderStageStatus;
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
          status?: OrderStageStatus;
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
          inspector: string;
          inspection_date: string;
          result: InspectionResult;
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
          inspector: string;
          inspection_date: string;
          result: InspectionResult;
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
          inspector?: string;
          inspection_date?: string;
          result?: InspectionResult;
          total_units?: number | null;
          defective_units?: number | null;
          photo_urls?: string[] | null;
          report_url?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      order_messages: {
        Row: {
          id: string;
          order_id: string;
          sender_id: string;
          sender_role: UserRole;
          original_text: string;
          translated_text: string | null;
          source_language: string;
          target_language: string;
          attachments: Json | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          sender_id: string;
          sender_role: UserRole;
          original_text: string;
          translated_text?: string | null;
          source_language?: string;
          target_language?: string;
          attachments?: Json | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          sender_id?: string;
          sender_role?: UserRole;
          original_text?: string;
          translated_text?: string | null;
          source_language?: string;
          target_language?: string;
          attachments?: Json | null;
          read?: boolean;
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
          type: DisputeType;
          description: string | null;
          evidence_urls: string[] | null;
          status: DisputeStatus;
          resolution: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          raised_by: string;
          type: DisputeType;
          description?: string | null;
          evidence_urls?: string[] | null;
          status?: DisputeStatus;
          resolution?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          raised_by?: string;
          type?: DisputeType;
          description?: string | null;
          evidence_urls?: string[] | null;
          status?: DisputeStatus;
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
          type: DocumentType;
          name: string;
          file_url: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          company_id?: string | null;
          type: DocumentType;
          name: string;
          file_url: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          company_id?: string | null;
          type?: DocumentType;
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
          type: PaymentType;
          amount: number;
          currency: string;
          status: PaymentStatus;
          method: string | null;
          reference: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          type: PaymentType;
          amount: number;
          currency?: string;
          status?: PaymentStatus;
          method?: string | null;
          reference?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          type?: PaymentType;
          amount?: number;
          currency?: string;
          status?: PaymentStatus;
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
    Enums: {
      company_type: CompanyType;
      user_role: UserRole;
      verification_method: VerificationMethod;
      supplier_preference: SupplierPreference;
      buy_request_status: BuyRequestStatus;
      quote_status: QuoteStatus;
      order_status: OrderStatus;
      order_stage_status: OrderStageStatus;
      customs_status: CustomsStatus;
      inspection_result: InspectionResult;
      dispute_type: DisputeType;
      dispute_status: DisputeStatus;
      payment_type: PaymentType;
      payment_status: PaymentStatus;
      document_type: DocumentType;
    };
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
export type OrderMessage = Database['public']['Tables']['order_messages']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Dispute = Database['public']['Tables']['disputes']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
