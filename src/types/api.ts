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
  totalTickets: number;
  overdueTickets: number;
  serverAlerts: number;
  avgServiceTime: string;
  resolutionRate: number;
  byResponsible: Array<{
    name: string;
    tickets: number;
    color: string;
  }>;
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

export interface ApiError {
  message: string;
  status?: number;
}