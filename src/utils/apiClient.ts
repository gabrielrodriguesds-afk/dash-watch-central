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

  // Dashboard data - usar endpoint /api/chamados do Milvus
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await fetch(`${this.baseURL}/api/chamados`);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API retornou formato inválido (esperado JSON)');
      }

      const data = await response.json();
      console.log("Dados recebidos da API Milvus:", data);
      
      // Mapear dados da API do Milvus para o formato esperado pelo dashboard
      const chamados = data.chamados || data.data || data || [];
      
      // Calcular métricas dos chamados
      const totalTickets = chamados.length;
      
      // Chamados em atraso (assumindo que há um campo de status ou data)
      const overdueTickets = chamados.filter((chamado: any) => {
        return chamado.status === 'atrasado' || 
               chamado.situacao === 'atrasado' ||
               chamado.prioridade === 'alta' ||
               chamado.prioridade === 'crítica';
      }).length;
      
      // Alertas do servidor (simulado baseado em chamados críticos)
      const serverAlerts = chamados.filter((chamado: any) => 
        chamado.prioridade === 'crítica' || 
        chamado.categoria?.includes('servidor') ||
        chamado.tipo?.includes('servidor')
      ).length;
      
      // Agrupar chamados por responsável
      const byResponsible = chamados.reduce((acc: any[], chamado: any) => {
        const responsavel = chamado.responsavel || 
                           chamado.atendente || 
                           chamado.tecnico || 
                           'Não atribuído';
        
        const existing = acc.find(item => item.name === responsavel);
        if (existing) {
          existing.tickets++;
        } else {
          acc.push({ 
            name: responsavel, 
            tickets: 1,
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
          });
        }
        return acc;
      }, []);
      
      // Calcular tempo médio de atendimento (simulado)
      const avgServiceTime = totalTickets > 0 ? "2h 30min" : "N/A";
      
      // Taxa de resolução (simulada baseada em status)
      const resolvedTickets = chamados.filter((chamado: any) => 
        chamado.status === 'resolvido' || 
        chamado.status === 'fechado' ||
        chamado.situacao === 'resolvido'
      ).length;
      
      const resolutionRate = totalTickets > 0 ? 
        Math.round((resolvedTickets / totalTickets) * 100) : 0;
      
      return {
        totalTickets,
        overdueTickets,
        serverAlerts,
        byResponsible,
        avgServiceTime,
        resolutionRate
      };
    } catch (error: any) {
      console.error("Erro ao carregar dados do Milvus:", error);
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