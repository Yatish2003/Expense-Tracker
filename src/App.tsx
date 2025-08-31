import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/add-expense" element={
            <DashboardLayout>
              <AddExpense />
            </DashboardLayout>
          } />
          <Route path="/expenses" element={
            <DashboardLayout>
              <Expenses />
            </DashboardLayout>
          } />
          <Route path="/analytics" element={
            <DashboardLayout>
              <Analytics />
            </DashboardLayout>
          } />
          <Route path="/budget" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Budget Feature</h1>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </DashboardLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
