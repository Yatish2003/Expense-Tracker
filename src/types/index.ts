export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  type: 'expense' | 'income';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  monthlyExpenses: number;
  monthlyIncome: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}