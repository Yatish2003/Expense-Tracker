import axios from 'axios';
import { Expense, Category } from '@/types';

// Mock API - Replace with real API endpoints
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Mock data for development
export const mockExpenses: Expense[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: 85.50,
    category: 'Food & Dining',
    date: '2024-01-15',
    description: 'Weekly groceries',
    type: 'expense',
  },
  {
    id: '2',
    title: 'Salary',
    amount: 3500.00,
    category: 'Salary',
    date: '2024-01-01',
    description: 'Monthly salary',
    type: 'income',
  },
  {
    id: '3',
    title: 'Gas Station',
    amount: 45.00,
    category: 'Transportation',
    date: '2024-01-10',
    description: 'Car fuel',
    type: 'expense',
  },
];

export const expenseApi = {
  // Get all expenses
  async getExpenses(): Promise<Expense[]> {
    try {
      // Replace with real API call
      // const response = await api.get('/expenses');
      // return response.data;
      return mockExpenses;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return mockExpenses;
    }
  },

  // Create new expense
  async createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    try {
      // Replace with real API call
      // const response = await api.post('/expenses', expense);
      // return response.data;
      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
      };
      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // Update expense
  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense> {
    try {
      // Replace with real API call
      // const response = await api.put(`/expenses/${id}`, expense);
      // return response.data;
      return { ...mockExpenses[0], ...expense, id };
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // Delete expense
  async deleteExpense(id: string): Promise<void> {
    try {
      // Replace with real API call
      // await api.delete(`/expenses/${id}`);
      console.log(`Deleted expense with id: ${id}`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },
};

export const categoryApi = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      // Replace with real API call
      // const response = await api.get('/categories');
      // return response.data;
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};