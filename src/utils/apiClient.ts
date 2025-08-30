import { LoginRequest, RegisterRequest, AuthResponse, DashboardData, Ticket, User, Task } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  // Dashboard data - usar endpoint /api/chamados do backend Express
  async getDashboardData(): Promise<DashboardData> {
    try {
      console.log(`Fazendo requisição para: ${this.baseURL}/api/chamados`);
      
      const response = await fetch(`${this.baseURL}/api/chamados`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API retornou formato inválido (esperado JSON)');
      }

      const data = await response.json();
      console.log("Dados recebidos do backend:", data);
      
      // Os dados já vêm no formato correto do backend
      return {
        totalOpen: data.totalTickets || 0,
        overdue: data.overdueTickets || 0,
        serverAlerts: data.serverAlerts || 0,
        byResponsible: data.byResponsible || [],
        avgServiceTime: data.avgServiceTime || "N/A",
        resolutionRate: data.resolutionRate || 0
      };
      
    } catch (error: any) {
      console.error("Erro ao carregar dados do dashboard:", error);
      
      // Mostrar erro mais detalhado
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`Não foi possível conectar com o backend em ${this.baseURL}. Verifique se o servidor está rodando.`);
      }
      
      throw new Error(error.message || 'Erro desconhecido ao carregar dados');
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

  // Task management
  async getTasks(): Promise<Task[]> {
    return this.publicRequest('/api/tarefas');
  }

  async addTask(descricao: string): Promise<Task> {
    return this.publicRequest('/api/tarefas', {
      method: 'POST',
      body: JSON.stringify({ descricao }),
    });
  }

  async resolveTask(id: string): Promise<Task> {
    return this.publicRequest(`/api/tarefas/${id}/resolver`, {
      method: 'PUT',
    });
  }
}

// Instância padrão
export const apiClient = new ApiClient();


