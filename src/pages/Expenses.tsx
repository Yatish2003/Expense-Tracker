import { useState } from "react";
import { useExpenseStore } from "@/store/expenseStore";
import { ExpenseCard } from "@/components/ExpenseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Expenses() {
  const { expenses, categories, deleteExpense } = useExpenseStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory;
    const matchesType = filterType === "all" || expense.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => {
    return expense.type === 'income' ? sum + expense.amount : sum - expense.amount;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            All Transactions
          </h1>
          <p className="text-muted-foreground">
            View and manage your expenses and income
          </p>
        </div>
        <Button asChild className="bg-gradient-primary hover:shadow-card">
          <Link to="/add-expense">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background/50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Total</label>
              <div className="flex items-center h-10 px-3 rounded-md bg-background/50 border">
                <span className={`font-medium ${totalAmount >= 0 ? 'text-income' : 'text-expense'}`}>
                  {totalAmount >= 0 ? '+' : ''}${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">
              {filteredExpenses.length} transactions found
            </Badge>
            {searchTerm && (
              <Badge variant="outline">
                Search: "{searchTerm}"
              </Badge>
            )}
            {filterCategory !== "all" && (
              <Badge variant="outline">
                Category: {filterCategory}
              </Badge>
            )}
            {filterType !== "all" && (
              <Badge variant="outline">
                Type: {filterType}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredExpenses.map((expense) => (
                <ExpenseCard 
                  key={expense.id} 
                  expense={expense}
                  onDelete={deleteExpense}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterCategory !== "all" || filterType !== "all" 
                  ? "No transactions match your filters" 
                  : "No transactions found"
                }
              </p>
              <Button asChild>
                <Link to="/add-expense">Add Your First Transaction</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}