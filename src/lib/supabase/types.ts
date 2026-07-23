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
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          password_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          password_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          password_hash?: string | null;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          billing_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_id: string;
          billing_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          billing_email?: string | null;
          updated_at?: string;
        };
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
          created_at?: string;
        };
        Update: {
          role?: 'owner' | 'admin' | 'member';
        };
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          plan: 'free' | 'pro' | 'team' | 'enterprise';
          billing_period: 'monthly' | 'yearly';
          status: 'active' | 'cancelled' | 'expired' | 'pending';
          paystack_reference: string | null;
          paystack_customer_code: string | null;
          amount_paid: number;
          currency: string;
          starts_at: string;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          plan: 'free' | 'pro' | 'team' | 'enterprise';
          billing_period: 'monthly' | 'yearly';
          status?: 'active' | 'cancelled' | 'expired' | 'pending';
          paystack_reference?: string | null;
          paystack_customer_code?: string | null;
          amount_paid: number;
          currency: string;
          starts_at?: string;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan?: 'free' | 'pro' | 'team' | 'enterprise';
          billing_period?: 'monthly' | 'yearly';
          status?: 'active' | 'cancelled' | 'expired' | 'pending';
          paystack_reference?: string | null;
          paystack_customer_code?: string | null;
          expires_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          region: string;
          database_host: string | null;
          database_port: number;
          database_name: string;
          api_url: string | null;
          anon_key: string | null;
          service_key: string | null;
          status: 'active' | 'paused' | 'restoring' | 'upgrading';
          postgres_version: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          region?: string;
          database_host?: string | null;
          database_port?: number;
          database_name?: string;
          api_url?: string | null;
          anon_key?: string | null;
          service_key?: string | null;
          status?: 'active' | 'paused' | 'restoring' | 'upgrading';
          postgres_version?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          region?: string;
          database_host?: string | null;
          api_url?: string | null;
          status?: 'active' | 'paused' | 'restoring' | 'upgrading';
          postgres_version?: string;
          updated_at?: string;
        };
      };
      database_tables: {
        Row: {
          id: string;
          project_id: string;
          schema_name: string;
          table_name: string;
          row_count: number;
          size_bytes: number;
          is_rls_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          schema_name?: string;
          table_name: string;
          row_count?: number;
          size_bytes?: number;
          is_rls_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          schema_name?: string;
          table_name?: string;
          row_count?: number;
          size_bytes?: number;
          is_rls_enabled?: boolean;
          updated_at?: string;
        };
      };
      storage_buckets: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          public: boolean;
          file_size_limit: number | null;
          allowed_mime_types: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          public?: boolean;
          file_size_limit?: number | null;
          allowed_mime_types?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          public?: boolean;
          file_size_limit?: number | null;
          allowed_mime_types?: string[] | null;
          updated_at?: string;
        };
      };
      storage_objects: {
        Row: {
          id: string;
          bucket_id: string;
          name: string;
          path: string;
          size: number;
          mime_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          bucket_id: string;
          name: string;
          path: string;
          size: number;
          mime_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          path?: string;
          size?: number;
          mime_type?: string | null;
          updated_at?: string;
        };
      };
      edge_functions: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          slug: string;
          status: 'active' | 'inactive' | 'error';
          verify_jwt: boolean;
          import_map: boolean;
          entrypoint_path: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          slug: string;
          status?: 'active' | 'inactive' | 'error';
          verify_jwt?: boolean;
          import_map?: boolean;
          entrypoint_path?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          status?: 'active' | 'inactive' | 'error';
          verify_jwt?: boolean;
          import_map?: boolean;
          entrypoint_path?: string;
          updated_at?: string;
        };
      };
      auth_users: {
        Row: {
          id: string;
          project_id: string;
          email: string | null;
          phone: string | null;
          email_confirmed_at: string | null;
          phone_confirmed_at: string | null;
          last_sign_in_at: string | null;
          provider: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          email?: string | null;
          phone?: string | null;
          email_confirmed_at?: string | null;
          phone_confirmed_at?: string | null;
          last_sign_in_at?: string | null;
          provider?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          phone?: string | null;
          email_confirmed_at?: string | null;
          phone_confirmed_at?: string | null;
          last_sign_in_at?: string | null;
          provider?: string;
          updated_at?: string;
        };
      };
      domains: {
        Row: {
          id: string;
          project_id: string;
          domain: string;
          is_primary: boolean;
          verified: boolean;
          ssl_status: 'pending' | 'active' | 'error';
          verification_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          domain: string;
          is_primary?: boolean;
          verified?: boolean;
          ssl_status?: 'pending' | 'active' | 'error';
          verification_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          domain?: string;
          is_primary?: boolean;
          verified?: boolean;
          ssl_status?: 'pending' | 'active' | 'error';
          verification_token?: string | null;
          updated_at?: string;
        };
      };
      sql_query_history: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          query: string;
          execution_time_ms: number;
          row_count: number;
          success: boolean;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          query: string;
          execution_time_ms: number;
          row_count?: number;
          success?: boolean;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          query?: string;
          execution_time_ms?: number;
          row_count?: number;
          success?: boolean;
          error_message?: string | null;
        };
      };
      api_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          api_id: string;
          api_name: string;
          billing_period: 'monthly' | 'yearly';
          status: 'trial' | 'active' | 'cancelled' | 'expired';
          api_key: string;
          amount_paid: number;
          currency: string;
          selected_languages: string[] | null;
          trial_ends_at: string | null;
          starts_at: string;
          expires_at: string;
          paystack_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          api_id: string;
          api_name: string;
          billing_period: 'monthly' | 'yearly';
          status?: 'trial' | 'active' | 'cancelled' | 'expired';
          api_key: string;
          amount_paid?: number;
          currency?: string;
          selected_languages?: string[] | null;
          trial_ends_at?: string | null;
          starts_at?: string;
          expires_at: string;
          paystack_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          billing_period?: 'monthly' | 'yearly';
          status?: 'trial' | 'active' | 'cancelled' | 'expired';
          amount_paid?: number;
          selected_languages?: string[] | null;
          expires_at?: string;
          paystack_reference?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type DatabaseTable = Database['public']['Tables']['database_tables']['Row'];
export type StorageBucket = Database['public']['Tables']['storage_buckets']['Row'];
export type StorageObject = Database['public']['Tables']['storage_objects']['Row'];
export type EdgeFunction = Database['public']['Tables']['edge_functions']['Row'];
export type AuthUser = Database['public']['Tables']['auth_users']['Row'];
export type Domain = Database['public']['Tables']['domains']['Row'];
export type SqlQueryHistory = Database['public']['Tables']['sql_query_history']['Row'];
export type ApiSubscription = Database['public']['Tables']['api_subscriptions']['Row'];
