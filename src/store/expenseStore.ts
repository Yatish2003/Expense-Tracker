import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense, Category, ExpenseStats, Budget, BudgetProgress } from '@/types';

interface ExpenseStore {
  expenses: Expense[];
  categories: Category[];
  stats: ExpenseStats;
  budgets: Budget[];
  budgetProgress: BudgetProgress[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  updateStats: () => void;
  updateBudgetProgress: () => void;
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
      budgets: [],
      budgetProgress: [],
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
        get().updateBudgetProgress();
      },
      
      updateExpense: (id, updatedExpense) => {
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          ),
        }));
        get().updateStats();
        get().updateBudgetProgress();
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
        get().updateStats();
        get().updateBudgetProgress();
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
      
      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: Date.now().toString(),
        };
        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
        get().updateBudgetProgress();
      },
      
      updateBudget: (id, updatedBudget) => {
        set((state) => ({
          budgets: state.budgets.map((budget) =>
            budget.id === id ? { ...budget, ...updatedBudget } : budget
          ),
        }));
        get().updateBudgetProgress();
      },
      
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((budget) => budget.id !== id),
        }));
        get().updateBudgetProgress();
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
      
      updateBudgetProgress: () => {
        const { expenses, budgets } = get();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const progress: BudgetProgress[] = budgets
          .filter(budget => budget.isActive)
          .map(budget => {
            let spentAmount = 0;
            let daysLeft = 0;
            
            if (budget.period === 'monthly') {
              // Calculate monthly spending
              spentAmount = expenses
                .filter(expense => {
                  const expenseDate = new Date(expense.date);
                  return (
                    expense.type === 'expense' &&
                    expense.category === budget.categoryName &&
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                  );
                })
                .reduce((sum, expense) => sum + expense.amount, 0);
              
              // Days left in current month
              const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
              daysLeft = lastDayOfMonth - currentDate.getDate();
            } else {
              // Calculate yearly spending
              spentAmount = expenses
                .filter(expense => {
                  const expenseDate = new Date(expense.date);
                  return (
                    expense.type === 'expense' &&
                    expense.category === budget.categoryName &&
                    expenseDate.getFullYear() === currentYear
                  );
                })
                .reduce((sum, expense) => sum + expense.amount, 0);
              
              // Days left in current year
              const lastDayOfYear = new Date(currentYear, 11, 31);
              daysLeft = Math.ceil((lastDayOfYear.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            }
            
            const budgetAmount = budget.period === 'monthly' ? budget.monthlyLimit : budget.yearlyLimit;
            const remainingAmount = budgetAmount - spentAmount;
            const percentageUsed = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
            const isOverBudget = spentAmount > budgetAmount;
            
            return {
              categoryName: budget.categoryName,
              budgetAmount,
              spentAmount,
              remainingAmount,
              percentageUsed,
              isOverBudget,
              daysLeft,
            };
          });
        
        set({ budgetProgress: progress });
      },
    }),
    {
      name: 'expense-store',
    }
  )
);