import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense, Category, ExpenseStats } from '@/types';

interface ExpenseStore {
  expenses: Expense[];
  categories: Category[];
  stats: ExpenseStats;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateStats: () => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#ef4444', icon: 'UtensilsCrossed' },
  { id: '2', name: 'Transportation', color: '#3b82f6', icon: 'Car' },
  { id: '3', name: 'Shopping', color: '#8b5cf6', icon: 'ShoppingBag' },
  { id: '4', name: 'Entertainment', color: '#f59e0b', icon: 'GameController2' },
  { id: '5', name: 'Bills & Utilities', color: '#06b6d4', icon: 'Receipt' },
  { id: '6', name: 'Healthcare', color: '#10b981', icon: 'Heart' },
  { id: '7', name: 'Salary', color: '#22c55e', icon: 'DollarSign' },
  { id: '8', name: 'Investment', color: '#84cc16', icon: 'TrendingUp' },
];

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      categories: defaultCategories,
      stats: {
        totalExpenses: 0,
        totalIncome: 0,
        balance: 0,
        monthlyExpenses: 0,
        monthlyIncome: 0,
      },
      
      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: Date.now().toString(),
        };
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));
        get().updateStats();
      },
      
      updateExpense: (id, updatedExpense) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          ),
        }));
        get().updateStats();
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
        get().updateStats();
      },
      
      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: Date.now().toString(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      updateStats: () => {
        const { expenses } = get();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const totalExpenses = expenses
          .filter((e) => e.type === 'expense')
          .reduce((sum, e) => sum + e.amount, 0);
        
        const totalIncome = expenses
          .filter((e) => e.type === 'income')
          .reduce((sum, e) => sum + e.amount, 0);
        
        const monthlyExpenses = expenses
          .filter((e) => {
            const expenseDate = new Date(e.date);
            return (
              e.type === 'expense' &&
              expenseDate.getMonth() === currentMonth &&
              expenseDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, e) => sum + e.amount, 0);
        
        const monthlyIncome = expenses
          .filter((e) => {
            const expenseDate = new Date(e.date);
            return (
              e.type === 'income' &&
              expenseDate.getMonth() === currentMonth &&
              expenseDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, e) => sum + e.amount, 0);
        
        set({
          stats: {
            totalExpenses,
            totalIncome,
            balance: totalIncome - totalExpenses,
            monthlyExpenses,
            monthlyIncome,
          },
        });
      },
    }),
    {
      name: 'expense-store',
    }
  )
);