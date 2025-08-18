import { MessageSquare, Clock, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  content: string;
  timestamp: string;
  priority: "normal" | "high" | "urgent";
}

// Mock data for demonstration
const messages: Message[] = [
  {
    id: 1,
    content: "Revisão dos processos de atendimento será implementada na próxima semana. Todos os responsáveis devem participar da reunião.",
    timestamp: "10:30",
    priority: "high"
  },
  {
    id: 2,
    content: "Parabéns pela redução no tempo médio de resposta dos tickets. Continue o excelente trabalho!",
    timestamp: "09:15",
    priority: "normal"
  },
  {
    id: 3,
    content: "URGENTE: Sistema de backup apresentou falha. Verificar imediatamente e reportar status.",
    timestamp: "08:45",
    priority: "urgent"
  },
  {
    id: 4,
    content: "Nova política de priorização de tickets entra em vigor amanhã. Consulte o manual atualizado.",
    timestamp: "Ontem",
    priority: "normal"
  }
];

export const MessagePanel = () => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "high":
        return <MessageSquare className="w-4 h-4 text-yellow-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-400";
      case "high":
        return "border-l-yellow-400";
      default:
        return "border-l-blue-400";
    }
  };

  return (
    <div className="dashboard-sidebar h-full rounded-l-xl p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-white/10">
          <MessageSquare className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mensagens do Diretor</h2>
          <p className="text-sm opacity-75">Comunicações importantes</p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg bg-white/5 border-l-4 ${getPriorityBorder(message.priority)} animate-fade-in backdrop-blur-sm hover:bg-white/10 transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                {getPriorityIcon(message.priority)}
                <div className="flex items-center gap-2 text-xs opacity-60">
                  <Clock className="w-3 h-3" />
                  {message.timestamp}
                </div>
              </div>
              
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {message.priority === "urgent" && (
                <div className="mt-3 px-2 py-1 bg-red-500/20 rounded text-xs text-red-300 font-medium">
                  URGENTE
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};