import { supabase } from '@/integrations/supabase/client';

// Utilitário para fazer chamadas autenticadas para sua API Flask
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:5000') {
    this.baseURL = baseURL;
  }

  // Método para fazer chamadas autenticadas
  async authenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Usuário não autenticado');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Exemplos de métodos para sua API
  async getTickets() {
    return this.authenticatedRequest('/api/tickets');
  }

  async createTicket(ticketData: any) {
    return this.authenticatedRequest('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(ticketId: string, ticketData: any) {
    return this.authenticatedRequest(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  }
}

// Instância padrão
export const apiClient = new ApiClient();