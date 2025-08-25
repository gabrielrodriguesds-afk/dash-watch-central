import { 
  Ticket, 
  Users, 
  AlertTriangle, 
  Server, 
  Clock, 
  CheckCircle,
  User,
  Headphones,
  Wrench
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import { MessagePanel } from "./MessagePanel";

// Mock data for demonstration
const ticketData = {
  totalOpen: 247,
  overdue: 12,
  serverAlerts: 3,
  byResponsible: [
    { name: "Mesa Remoto", count: 45, icon: Headphones },
    { name: "Mesa Adrian", count: 38, icon: User },
    { name: "Mitchel", count: 32, icon: User },
    { name: "Hiago", count: 41, icon: User },
    { name: "Assistência Técnica", count: 67, icon: Wrench },
    { name: "Samuel", count: 24, icon: User },
  ]
};

export const Dashboard = () => {
  return (
    <div className="min-h-screen dashboard-bg">
      <div className="flex h-screen">
        {/* Main Dashboard Content */}
        <div className="flex-1 p-8 pr-4">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Dashboard de Monitoramento
            </h1>
            <p className="text-dashboard-muted">
              Visão geral dos tickets e alertas do sistema
            </p>
          </div>

          {/* Main Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total de Tickets Abertos"
              value={ticketData.totalOpen}
              icon={Ticket}
              variant="primary"
              subtitle="Em andamento"
              className="md:col-span-2"
            />
            
            <MetricCard
              title="Tickets Estourados"
              value={ticketData.overdue}
              icon={AlertTriangle}
              variant="danger"
              subtitle="Requer atenção"
            />
            
            <MetricCard
              title="Alertas de Servidor"
              value={ticketData.serverAlerts}
              icon={Server}
              variant={ticketData.serverAlerts > 0 ? "warning" : "success"}
              subtitle="Monitoramento ativo"
            />
          </div>

          {/* Tickets by Responsible */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Tickets por Responsável
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ticketData.byResponsible.map((responsible, index) => (
                <div 
                  key={responsible.name}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MetricCard
                    title={responsible.name}
                    value={responsible.count}
                    icon={responsible.icon}
                    variant="default"
                    subtitle="tickets ativos"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Metrics Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Tempo Médio de Atendimento"
              value={24}
              icon={Clock}
              variant="success"
              subtitle="minutos"
            />
            
            <MetricCard
              title="Taxa de Resolução"
              value={87}
              icon={CheckCircle}
              variant="success"
              subtitle="% hoje"
            />
          </div>
        </div>

        {/* Sidebar - Messages Panel */}
        <div className="w-96 h-full">
          <MessagePanel />
        </div>
      </div>
    </div>
  );
};