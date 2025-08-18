import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "danger" | "warning";
  subtitle?: string;
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = "default", 
  subtitle,
  className 
}: MetricCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "metric-primary text-white";
      case "success":
        return "metric-success text-white";
      case "danger":
        return "metric-danger text-white";
      case "warning":
        return "metric-warning text-dashboard-sidebar";
      default:
        return "dashboard-card text-foreground";
    }
  };

  return (
    <div className={cn(
      "p-6 rounded-xl transition-all duration-300 animate-scale-in",
      getVariantClasses(),
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
          <Icon className="w-6 h-6" />
        </div>
        {variant === "danger" && value > 0 && (
          <div className="animate-pulse-soft">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {subtitle && (
          <p className="text-sm opacity-75">{subtitle}</p>
        )}
      </div>
    </div>
  );
};