import { useEffect } from "react";
import { useExpenseStore } from "@/store/expenseStore";
import { StatsCard } from "@/components/StatsCard";
import { ExpenseCard } from "@/components/ExpenseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#10b981'];

export default function Dashboard() {
  const { expenses, stats, updateStats } = useExpenseStore();
  
  useEffect(() => {
    updateStats();
  }, [updateStats]);

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const categoryData = expenses
    .filter(e => e.type === 'expense')
    .reduce((acc, expense) => {
      const existing = acc.find(item => item.name === expense.category);
      if (existing) {
        existing.value += expense.amount;
      } else {
        acc.push({ name: expense.category, value: expense.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .slice(0, 6);

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const monthExpenses = expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getMonth() === date.getMonth() && 
               expenseDate.getFullYear() === date.getFullYear();
      });
    
    const totalExpenses = monthExpenses
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
      
    const totalIncome = monthExpenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      month: monthName,
      expenses: totalExpenses,
      income: totalIncome,
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your expenses and manage your budget
          </p>
        </div>
        <Button asChild className="bg-gradient-primary hover:shadow-card">
          <Link to="/add-expense">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Balance"
          value={`$${stats.balance.toFixed(2)}`}
          icon={Wallet}
          gradient={stats.balance >= 0 ? 'income' : 'expense'}
          trend={{
            value: `${stats.monthlyIncome - stats.monthlyExpenses >= 0 ? '+' : ''}$${(stats.monthlyIncome - stats.monthlyExpenses).toFixed(2)}`,
            isPositive: stats.monthlyIncome - stats.monthlyExpenses >= 0
          }}
        />
        <StatsCard
          title="Monthly Income"
          value={`$${stats.monthlyIncome.toFixed(2)}`}
          icon={TrendingUp}
          gradient="income"
        />
        <StatsCard
          title="Monthly Expenses"
          value={`$${stats.monthlyExpenses.toFixed(2)}`}
          icon={TrendingDown}
          gradient="expense"
        />
        <StatsCard
          title="Total Expenses"
          value={`$${stats.totalExpenses.toFixed(2)}`}
          icon={DollarSign}
          gradient="primary"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
                <Bar dataKey="income" fill="hsl(var(--income))" name="Income" />
                <Bar dataKey="expenses" fill="hsl(var(--expense))" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" asChild>
              <Link to="/expenses">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentExpenses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentExpenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expenses found</p>
              <Button asChild className="mt-4">
                <Link to="/add-expense">Add Your First Expense</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}