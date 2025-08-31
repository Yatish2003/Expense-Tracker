import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar } from "lucide-react";
import { Expense } from "@/types";
import { format } from "date-fns";

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export const ExpenseCard = ({ expense, onEdit, onDelete }: ExpenseCardProps) => {
  const isIncome = expense.type === 'income';
  
  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-lg transition-all duration-300 border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{expense.title}</CardTitle>
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(expense)}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(expense.id)}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-lg font-semibold ${
              isIncome ? 'text-income' : 'text-expense'
            }`}>
              {isIncome ? '+' : '-'}${expense.amount.toFixed(2)}
            </span>
            <Badge 
              variant="secondary" 
              className={`${isIncome ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'}`}
            >
              {expense.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(expense.date), 'MMM dd, yyyy')}
          </div>
          
          {expense.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {expense.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};