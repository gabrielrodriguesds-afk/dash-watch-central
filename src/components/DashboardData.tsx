import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/utils/apiClient';
import { DashboardData } from '@/types/api';
import { MetricCard } from '@/components/MetricCard';
import { MetricCardText } from '@/components/MetricCardText';
import { MessagePanel } from '@/components/MessagePanel';
import { Loader2, Users, AlertTriangle, Server, Clock, Target } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiClient.getDashboardData();
        setDashboardData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar os dados do dashboard",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dashboard-bg">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center dashboard-bg">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Erro ao carregar dados</h2>
          <p className="text-muted-foreground">Não foi possível conectar com a API Flask</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-bg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Sistema de Monitoramento
                </p>
              </div>
            </div>

            {/* Main Dashboard */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-foreground">Sistema de Monitoramento</h2>
                <p className="text-muted-foreground">Acompanhe o status dos seus sistemas em tempo real</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard
                  title="Total de Tickets Abertos"
                  value={dashboardData.totalTickets}
                  icon={Users}
                  variant="primary"
                  className="animate-scale-in"
                />
                <MetricCard
                  title="Tickets em Atraso"
                  value={dashboardData.overdueTickets}
                  icon={AlertTriangle}
                  variant="warning"
                  className="animate-scale-in"
                  style={{ animationDelay: "0.1s" }}
                />
                <MetricCard
                  title="Alertas do Servidor"
                  value={dashboardData.serverAlerts}
                  icon={Server}
                  variant="danger"
                  className="animate-scale-in"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>

              {/* Responsible Persons Grid */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Tickets por Responsável</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dashboardData.byResponsible.map((person, index) => (
                    <MetricCard
                      key={person.name}
                      title={person.name}
                      value={person.tickets}
                      icon={Users}
                      variant="default"
                      className="animate-scale-in"
                      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                    />
                  ))}
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCardText
                  title="Tempo Médio de Atendimento"
                  value={dashboardData.avgServiceTime}
                  icon={Clock}
                  variant="default"
                  className="animate-scale-in"
                  style={{ animationDelay: "0.3s" }}
                />
                <MetricCardText
                  title="Taxa de Resolução"
                  value={`${dashboardData.resolutionRate}%`}
                  icon={Target}
                  variant="success"
                  className="animate-scale-in"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <MessagePanel />
          </div>
        </div>
      </div>
    </div>
  );
};