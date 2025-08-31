import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradient?: 'income' | 'expense' | 'primary' | 'card';
}

export const StatsCard = ({ title, value, icon: Icon, trend, gradient = 'card' }: StatsCardProps) => {
  const gradientClasses = {
    income: 'bg-gradient-income shadow-income',
    expense: 'bg-gradient-expense shadow-expense',
    primary: 'bg-gradient-primary shadow-card',
    card: 'bg-gradient-card shadow-card',
  };

  return (
    <Card className={`${gradientClasses[gradient]} border-0 text-white`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 opacity-80" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {trend && (
          <p className={`text-xs opacity-80 ${
            trend.isPositive ? 'text-green-200' : 'text-red-200'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};