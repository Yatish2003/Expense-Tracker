import {
  LayoutDashboard,
  PlusCircle,
  Receipt,
  TrendingUp,
  PieChart,
  Target,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useExpenseStore } from "@/store/expenseStore";
import { Card } from "@/components/ui/card";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Add Expense", url: "/add-expense", icon: PlusCircle },
  { title: "Expenses", url: "/expenses", icon: Receipt },
  { title: "Analytics", url: "/analytics", icon: PieChart },
  { title: "Budget", url: "/budget", icon: Target },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { stats } = useExpenseStore();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {state === "expanded" && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <Card className="p-4 bg-gradient-card shadow-card">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className={`text-sm font-medium ${
                      stats.balance >= 0 ? 'text-income' : 'text-expense'
                    }`}>
                      ${Math.abs(stats.balance).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <TrendingUp className="h-4 w-4 text-income" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +${stats.monthlyIncome.toFixed(2)} | -${stats.monthlyExpenses.toFixed(2)}
                  </div>
                </div>
              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}