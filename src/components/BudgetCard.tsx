import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { Budget } from "@/types";

interface BudgetCardProps {
  budget: Budget;
  progress?: {
    spentAmount: number;
    remainingAmount: number;
    percentageUsed: number;
    isOverBudget: boolean;
    daysLeft: number;
  };
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export const BudgetCard = ({ budget, progress, onEdit, onDelete }: BudgetCardProps) => {
  const budgetLimit = budget.period === 'monthly' ? budget.monthlyLimit : budget.yearlyLimit;
  const spentAmount = progress?.spentAmount || 0;
  const percentageUsed = progress?.percentageUsed || 0;
  const isOverBudget = progress?.isOverBudget || false;
  const isNearLimit = percentageUsed >= budget.alertThreshold;
  
  const getProgressColor = () => {
    if (isOverBudget) return 'bg-destructive';
    if (isNearLimit) return 'bg-warning';
    return 'bg-primary';
  };

  const getStatusBadge = () => {
    if (isOverBudget) {
      return <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        Over Budget
      </Badge>;
    }
    if (isNearLimit) {
      return <Badge variant="secondary" className="gap-1 bg-warning/10 text-warning">
        <AlertTriangle className="h-3 w-3" />
        Near Limit
      </Badge>;
    }
    return <Badge variant="secondary" className="gap-1 bg-success/10 text-success">
      <TrendingUp className="h-3 w-3" />
      On Track
    </Badge>;
  };

  return (
    <Card className="bg-gradient-card shadow-card border-0 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{budget.categoryName}</CardTitle>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(budget)}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(budget.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            ${budgetLimit.toFixed(2)}
          </span>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent: ${spentAmount.toFixed(2)}</span>
            <span className="text-muted-foreground">{percentageUsed.toFixed(1)}%</span>
          </div>
          <Progress 
            value={Math.min(percentageUsed, 100)} 
            className="h-2"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className={`font-medium ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
              ${Math.max(progress?.remainingAmount || budgetLimit, 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Days Left
            </p>
            <p className="font-medium">
              {progress?.daysLeft || 0}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <Badge variant="outline" className="text-xs">
            {budget.period === 'monthly' ? 'Monthly' : 'Yearly'} Budget
          </Badge>
          <Badge variant={budget.isActive ? "default" : "secondary"} className="text-xs">
            {budget.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};