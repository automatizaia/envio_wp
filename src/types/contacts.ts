export interface Contact {
  id: string;
  nome: string;
  telefone: string;
}

export interface SupabaseContact extends Contact {
  created_at?: string;
  updated_at?: string;
}
