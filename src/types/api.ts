// API Types for Flask Integration

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface DashboardData {
  totalOpen: number;
  overdue: number;
  serverAlerts: number;
  avgServiceTime: string | number;
  resolutionRate: number;
  byResponsible: Array<{
    name: string;
    tickets: number;
    color?: string;
  }>;
  nextUpdate?: string;
  lastUpdate?: string;
  error?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  descricao: string;
  status: 'pendente' | 'resolvida';
  dataCriacao: string;
  dataExpiracao: string;
  dataResolucao: string | null;
}

export interface ApiError {
  message: string;
  status?: number;
}


