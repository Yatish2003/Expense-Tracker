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

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  monthlyLimit: number;
  yearlyLimit: number;
  period: 'monthly' | 'yearly';
  alertThreshold: number; // percentage (e.g., 80 for 80%)
  isActive: boolean;
}

export interface BudgetProgress {
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverBudget: boolean;
  daysLeft: number;
}