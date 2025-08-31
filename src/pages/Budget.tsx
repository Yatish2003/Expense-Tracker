import { useState, useEffect } from "react";
import { useExpenseStore } from "@/store/expenseStore";
import { BudgetCard } from "@/components/BudgetCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Target, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { Budget as BudgetType } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Budget() {
  const { budgets, categories, budgetProgress, addBudget, updateBudget, deleteBudget, updateBudgetProgress } = useExpenseStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetType | null>(null);
  
  const [formData, setFormData] = useState({
    categoryName: '',
    monthlyLimit: '',
    yearlyLimit: '',
    period: 'monthly' as 'monthly' | 'yearly',
    alertThreshold: '80',
    isActive: true,
  });

  useEffect(() => {
    updateBudgetProgress();
  }, [updateBudgetProgress]);

  const resetForm = () => {
    setFormData({
      categoryName: '',
      monthlyLimit: '',
      yearlyLimit: '',
      period: 'monthly',
      alertThreshold: '80',
      isActive: true,
    });
    setEditingBudget(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryName || (!formData.monthlyLimit && !formData.yearlyLimit)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const budgetData = {
      categoryId: categories.find(c => c.name === formData.categoryName)?.id || '',
      categoryName: formData.categoryName,
      monthlyLimit: parseFloat(formData.monthlyLimit) || 0,
      yearlyLimit: parseFloat(formData.yearlyLimit) || 0,
      period: formData.period,
      alertThreshold: parseFloat(formData.alertThreshold),
      isActive: formData.isActive,
    };

    if (editingBudget) {
      updateBudget(editingBudget.id, budgetData);
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    } else {
      // Check if budget for this category already exists
      const existingBudget = budgets.find(b => b.categoryName === formData.categoryName);
      if (existingBudget) {
        toast({
          title: "Error",
          description: "Budget for this category already exists",
          variant: "destructive",
        });
        return;
      }
      
      addBudget(budgetData);
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (budget: BudgetType) => {
    setEditingBudget(budget);
    setFormData({
      categoryName: budget.categoryName,
      monthlyLimit: budget.monthlyLimit.toString(),
      yearlyLimit: budget.yearlyLimit.toString(),
      period: budget.period,
      alertThreshold: budget.alertThreshold.toString(),
      isActive: budget.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteBudget(id);
    toast({
      title: "Success",
      description: "Budget deleted successfully",
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate overall budget stats
  const totalBudgetAmount = budgetProgress.reduce((sum, progress) => sum + progress.budgetAmount, 0);
  const totalSpentAmount = budgetProgress.reduce((sum, progress) => sum + progress.spentAmount, 0);
  const overBudgetCount = budgetProgress.filter(p => p.isOverBudget).length;
  const nearLimitCount = budgetProgress.filter(p => p.percentageUsed >= 80 && !p.isOverBudget).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Budget Management
          </h1>
          <p className="text-muted-foreground">
            Set spending limits and track your financial goals
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-gradient-primary hover:shadow-card">
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? 'Edit Budget' : 'Create New Budget'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.categoryName} onValueChange={(value) => handleInputChange('categoryName', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(category => 
                      !budgets.some(budget => budget.categoryName === category.name) || 
                      editingBudget?.categoryName === category.name
                    ).map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Budget Period</Label>
                <Select value={formData.period} onValueChange={(value: 'monthly' | 'yearly') => handleInputChange('period', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.monthlyLimit}
                    onChange={(e) => handleInputChange('monthlyLimit', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearlyLimit">Yearly Limit</Label>
                  <Input
                    id="yearlyLimit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.yearlyLimit}
                    onChange={(e) => handleInputChange('yearlyLimit', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
                <Input
                  id="alertThreshold"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="80"
                  value={formData.alertThreshold}
                  onChange={(e) => handleInputChange('alertThreshold', e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active Budget</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingBudget ? 'Update Budget' : 'Create Budget'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-primary shadow-card border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Budget
            </CardTitle>
            <Target className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgetAmount.toFixed(2)}</div>
            <p className="text-xs opacity-80">
              {budgets.length} active budgets
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-expense shadow-expense border-0 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Spent
            </CardTitle>
            <DollarSign className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpentAmount.toFixed(2)}</div>
            <p className="text-xs opacity-80">
              {totalBudgetAmount > 0 ? ((totalSpentAmount / totalBudgetAmount) * 100).toFixed(1) : 0}% of budget used
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Over Budget
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overBudgetCount}</div>
            <p className="text-xs text-muted-foreground">
              categories over limit
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Near Limit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{nearLimitCount}</div>
            <p className="text-xs text-muted-foreground">
              categories near limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Summary */}
      {(overBudgetCount > 0 || nearLimitCount > 0) && (
        <Card className="bg-gradient-card shadow-card border-0 border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {overBudgetCount > 0 && (
                <Badge variant="destructive">
                  {overBudgetCount} over budget
                </Badge>
              )}
              {nearLimitCount > 0 && (
                <Badge variant="secondary" className="bg-warning/10 text-warning">
                  {nearLimitCount} near limit
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Cards */}
      <Card className="bg-gradient-card shadow-card border-0">
        <CardHeader>
          <CardTitle>Your Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {budgets.map((budget) => {
                const progress = budgetProgress.find(p => p.categoryName === budget.categoryName);
                return (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    progress={progress}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No budgets created yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Create Your First Budget
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}