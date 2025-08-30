import { 
  Ticket, 
  Users, 
  AlertTriangle, 
  Server, 
  Clock, 
  CheckCircle,
  User,
  Headphones,
  Wrench,
  Wifi,
  WifiOff
} from "lucide-react";
import { MetricCard } from "./MetricCard";
import { MessagePanel } from "./MessagePanel";
import React, { useEffect, useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/utils/apiClient';
import { DashboardData } from '@/types/api';
import { MetricCardText } from '@/components/MetricCardText';
import { Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'waiting'>('disconnected');
  const [nextUpdate, setNextUpdate] = useState<string>('');
  const prevTotalTickets = useRef<number | null>(null);
  const prevOverdueTickets = useRef<number | null>(null);

  const playSoundAndSpeak = async (message: string) => {
    try {
      // PRIMEIRO: Reproduzir o som de alerta
      const audio = new Audio("/sounds/alert.wav");
      await audio.play();
      
      // SEGUNDO: Aguardar um pouco para o som terminar antes da voz
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = 'pt-BR';
          utterance.rate = 0.9; // Velocidade um pouco mais lenta
          window.speechSynthesis.speak(utterance);
        } else {
          console.warn('SpeechSynthesis API não suportada neste navegador.');
        }
      }, 800); // Aguarda 800ms após o som para iniciar a voz
      
    } catch (error) {
      console.error('Erro ao reproduzir som ou fala:', error);
    }
  };

  const fetchData = async () => {
    console.log("Iniciando fetchData...");
    try {
      setConnectionStatus('waiting');
      const data = await apiClient.getDashboardData();
      console.log("Dados recebidos do apiClient:", data);
      
      // Armazena os valores atuais antes de atualizar o estado
      const currentTotalTickets = dashboardData?.totalOpen;
      const currentOverdueTickets = dashboardData?.overdue;

      setDashboardData(data);
      setConnectionStatus('connected');
      
      // Atualiza informações de próxima atualização se disponível
      if (data.nextUpdate) {
        setNextUpdate(data.nextUpdate);
      }
      
      console.log("dashboardData atualizado:", data);

      // Compara os novos dados com os dados anteriores (armazenados no useRef)
      // Dispara o alerta APENAS se houver uma mudança real e não for a primeira carga
      if (prevTotalTickets.current !== null && data.totalOpen !== prevTotalTickets.current) {
        const diff = data.totalOpen - prevTotalTickets.current;
        const message = `Atenção! O número de tickets abertos ${diff > 0 ? 'aumentou' : 'diminuiu'} para ${data.totalOpen}.`;
        playSoundAndSpeak(message);
        console.log("Alerta de tickets abertos disparado:", message);
      }
      if (prevOverdueTickets.current !== null && data.overdue !== prevOverdueTickets.current) {
        const diff = data.overdue - prevOverdueTickets.current;
        const message = `Alerta! O número de tickets em atraso ${diff > 0 ? 'aumentou' : 'diminuiu'} para ${data.overdue}.`;
        playSoundAndSpeak(message);
        console.log("Alerta de tickets em atraso disparado:", message);
      }

      // Atualiza os valores de referência para a próxima comparação
      prevTotalTickets.current = data.totalOpen;
      prevOverdueTickets.current = data.overdue;

    } catch (error: any) {
      console.error("Erro ao carregar dados no fetchData:", error);
      setConnectionStatus('disconnected');
      
      // Verifica se é erro de rate limit (429) ou loading (503)
      if (error.message.includes('429') || error.message.includes('aguarde')) {
        toast({
          variant: "default",
          title: "API Milvus - Aguardando",
          description: "Respeitando limite de 1 minuto entre requisições. Dados serão atualizados automaticamente.",
        });
      } else if (error.message.includes('503') || error.message.includes('carregando')) {
        toast({
          variant: "default",
          title: "Carregando dados",
          description: "Sistema buscando dados da API Milvus, aguarde...",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar os dados do dashboard",
        });
      }
    } finally {
      setLoading(false);
      console.log("Loading set to false.");
    }
  };

  useEffect(() => {
    console.log("useEffect disparado.");
    fetchData(); // Busca inicial

    // Configura o intervalo de atualização (a cada 5 minutos = 300000 ms)
    // Respeitando as limitações da API Milvus
    const intervalId = setInterval(fetchData, 300000);
    console.log("Intervalo de atualização configurado para 5 minutos (respeitando limitações da API Milvus).");

    // Limpa o intervalo quando o componente é desmontado
    return () => {
      clearInterval(intervalId);
      console.log("Intervalo de atualização limpo.");
    };
  }, [toast]); // Removido dashboardData das dependências para evitar loop infinito

  console.log("Renderizando Dashboard. Loading:", loading, "dashboardData:", dashboardData);
  if (loading || !dashboardData) {
    console.log("Exibindo tela de carregamento.");
    return (
      <div className="min-h-screen flex items-center justify-center dashboard-bg">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
          <p className="text-sm text-muted-foreground">
            {connectionStatus === 'waiting' && "Aguardando resposta da API Milvus..."}
            {connectionStatus === 'disconnected' && "Conectando com API Milvus..."}
          </p>
        </div>
      </div>
    );
  }

  console.log("Dashboard carregado, exibindo conteúdo.");

  return (
    <div className="min-h-screen dashboard-bg">
      <div className="flex h-screen">
        {/* Main Dashboard Content */}
        <div className="flex-1 p-8 pr-4">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Dashboard de Monitoramento
                </h1>
                <p className="text-dashboard-muted">
                  Visão geral dos tickets e alertas do sistema
                </p>
              </div>
              
              {/* Status de Conexão */}
              <div className="flex items-center space-x-2">
                {connectionStatus === 'connected' && (
                  <>
                    <Wifi className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600">Conectado</span>
                  </>
                )}
                {connectionStatus === 'disconnected' && (
                  <>
                    <WifiOff className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-red-600">Desconectado</span>
                  </>
                )}
                {connectionStatus === 'waiting' && (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                    <span className="text-sm text-yellow-600">Aguardando API</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Informações de atualização */}
            {dashboardData.lastUpdate && (
              <div className="mt-2 text-xs text-muted-foreground">
                Última atualização: {new Date(dashboardData.lastUpdate).toLocaleString('pt-BR')}
                {nextUpdate && (
                  <span className="ml-4">
                    Próxima atualização: {new Date(nextUpdate).toLocaleTimeString('pt-BR')}
                  </span>
                )}
              </div>
            )}
            
            {/* Aviso sobre dados desatualizados */}
            {dashboardData.error && (
              <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800">
                ⚠️ {dashboardData.error}
              </div>
            )}
          </div>

          {/* Main Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total de Tickets Abertos"
              value={dashboardData.totalOpen}
              icon={Ticket}
              variant="primary"
              subtitle="Em andamento"
              className="md:col-span-2"
            />
            
            <MetricCard
              title="Tickets Estourados"
              value={dashboardData.overdue}
              icon={AlertTriangle}
              variant="danger"
              subtitle="Requer atenção"
            />
            
            <MetricCard
              title="Alertas de Servidor"
              value={dashboardData.serverAlerts}
              icon={Server}
              variant={dashboardData.serverAlerts > 0 ? "warning" : "success"}
              subtitle="Monitoramento ativo"
            />
          </div>

          {/* Tickets by Responsible */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              Tickets por Responsável
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.byResponsible.map((responsible, index) => (
                <div 
                  key={responsible.name}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <MetricCard
                    title={responsible.name}
                    value={responsible.tickets}
                    icon={User}
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
              value={dashboardData.avgServiceTime}
              icon={Clock}
              variant="success"
              subtitle="minutos"
            />
            
            <MetricCard
              title="Taxa de Resolução"
              value={`${dashboardData.resolutionRate}%`}
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

