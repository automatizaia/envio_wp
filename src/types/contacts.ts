
export interface Contact {
  id: string;
  name: string;
  phone: string;
  status: string;
}

export interface SupabaseContact extends Contact {
  created_at?: string;
  updated_at?: string;
}
