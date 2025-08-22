import { LoginRequest, RegisterRequest, AuthResponse, DashboardData, Ticket, User } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Utilitário para fazer chamadas autenticadas para sua API Flask
export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Método para fazer chamadas autenticadas
  async authenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Método para chamadas não autenticadas (login/registro)
  async publicRequest(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Autenticação
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.publicRequest('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.publicRequest('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard data - usar endpoint /api/dados
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await fetch(`${this.baseURL}/api/dados`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API retornou formato inválido (esperado JSON)');
      }

      const data = await response.json();
      console.log("Dados recebidos da API:", data);
      
      // Mapear dados da API para o formato esperado pelo dashboard
      return {
        totalTickets: data.tickets?.length || 0,
        overdueTickets: data.tickets?.filter((t: any) => t.atrasado)?.length || 0,
        serverAlerts: data.alertas?.length || 0,
        byResponsible: data.tickets?.reduce((acc: any[], ticket: any) => {
          const existing = acc.find(item => item.name === ticket.responsavel);
          if (existing) {
            existing.tickets++;
          } else {
            acc.push({ name: ticket.responsavel, tickets: 1 });
          }
          return acc;
        }, []) || [],
        avgServiceTime: data.tempo_medio || "N/A",
        resolutionRate: data.taxa_resolucao || 0
      };
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
      // Retornar estrutura vazia em caso de erro
      return {
        totalTickets: 0,
        overdueTickets: 0,
        serverAlerts: 0,
        byResponsible: [],
        avgServiceTime: "N/A",
        resolutionRate: 0
      };
    }
  }

  // Tickets
  async getTickets(): Promise<Ticket[]> {
    return this.authenticatedRequest('/api/tickets');
  }

  async createTicket(ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
    return this.authenticatedRequest('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateTicket(ticketId: string, ticketData: Partial<Ticket>): Promise<Ticket> {
    return this.authenticatedRequest(`/api/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  }

  // User profile
  async getProfile(): Promise<User> {
    return this.authenticatedRequest('/api/profile');
  }
}

// Instância padrão
export const apiClient = new ApiClient();