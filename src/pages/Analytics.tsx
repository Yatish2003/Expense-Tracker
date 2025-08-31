import { useExpenseStore } from "@/store/expenseStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

const COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#10b981', '#f97316', '#84cc16'];

export default function Analytics() {
  const { expenses } = useExpenseStore();

  // Category breakdown
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
    }, [] as { name: string; value: number }[]);

  // Monthly trends
  const monthlyTrends = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const monthExpenses = expenses.filter(e => {
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
      net: totalIncome - totalExpenses,
    };
  }).reverse();

  // Weekly spending
  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (i * 7));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    const weekExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= startDate && expenseDate <= endDate && e.type === 'expense';
    });
    
    const total = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      week: `Week ${i + 1}`,
      amount: total,
    };
  }).reverse();

  const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const avgMonthlyExpenses = monthlyTrends.reduce((sum, m) => sum + m.expenses, 0) / monthlyTrends.length;
  const avgMonthlyIncome = monthlyTrends.reduce((sum, m) => sum + m.income, 0) / monthlyTrends.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Detailed insights into your spending patterns
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-income shadow-income border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
            <p className="text-xs opacity-80">
              Avg: ${avgMonthlyIncome.toFixed(2)}/month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-expense shadow-expense border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs opacity-80">
              Avg: ${avgMonthlyExpenses.toFixed(2)}/month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-primary shadow-card border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Net Worth
            </CardTitle>
            <BarChart3 className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalIncome - totalExpenses).toFixed(2)}
            </div>
            <p className="text-xs opacity-80">
              {totalIncome > totalExpenses ? "Positive" : "Negative"} balance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categories
            </CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryData.length}</div>
            <p className="text-xs text-muted-foreground">
              Active categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
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
            <CardTitle>Weekly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Spent']} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Monthly Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
              <Bar dataKey="income" fill="hsl(var(--income))" name="Income" />
              <Bar dataKey="expenses" fill="hsl(var(--expense))" name="Expenses" />
              <Bar dataKey="net" fill="hsl(var(--primary))" name="Net" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}