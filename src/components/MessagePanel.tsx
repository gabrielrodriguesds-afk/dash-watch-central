import React, { useEffect, useState, useRef } from "react";
import { MessageSquare, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/utils/apiClient";
import { Task } from "@/types/api";

export const MessagePanel = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const prevTaskCount = useRef<number>(0);

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

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await apiClient.getTasks();
      setTasks(fetchedTasks);

      // Disparar alerta vocal para novas tarefas
      if (fetchedTasks.length > prevTaskCount.current) {
        const newTasks = fetchedTasks.slice(prevTaskCount.current);
        newTasks.forEach(task => {
          playSoundAndSpeak(`Nova tarefa: ${task.descricao}`);
        });
      }
      prevTaskCount.current = fetchedTasks.length;

    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const handleResolveTask = async (id: string) => {
    try {
      await apiClient.resolveTask(id);
      fetchTasks(); // Recarrega as tarefas após resolver
    } catch (error) {
      console.error("Erro ao resolver tarefa:", error);
    }
  };

  useEffect(() => {
    fetchTasks(); // Busca inicial

    // Configura o intervalo de atualização (a cada 1 minuto = 60000 ms)
    const intervalId = setInterval(fetchTasks, 60000);

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);

  const getPriorityIcon = (status: string) => {
    switch (status) {
      case "pendente":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "resolvida":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  const getPriorityBorder = (status: string) => {
    switch (status) {
      case "pendente":
        return "border-l-yellow-400";
      case "resolvida":
        return "border-l-green-400";
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
          {tasks.length === 0 && (
            <p className="text-muted-foreground text-center">Nenhuma tarefa pendente.</p>
          )}
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg bg-white/5 border-l-4 ${getPriorityBorder(task.status)} animate-fade-in backdrop-blur-sm hover:bg-white/10 transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                {getPriorityIcon(task.status)}
                <div className="flex items-center gap-2 text-xs opacity-60">
                  <Clock className="w-3 h-3" />
                  {new Date(task.dataCriacao).toLocaleDateString()} {new Date(task.dataCriacao).toLocaleTimeString()}
                </div>
              </div>
              
              <p className="text-sm leading-relaxed">{task.descricao}</p>
              
              {task.status === "pendente" && (
                <div className="mt-3 text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleResolveTask(task.id)}
                    className="text-xs"
                  >
                    Marcar como Resolvida
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};


