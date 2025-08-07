
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";

import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import InventoryPage from "@/pages/InventoryPage";
import RecipesPage from "@/pages/RecipesPage";
import DietaryInfoPage from "@/pages/DietaryInfoPage";
import MealPlannerPage from "@/pages/MealPlannerPage";
import StorageLocationsPage from "@/pages/StorageLocationsPage";
import ProfilePage from "@/pages/ProfilePage";
import TestPage from "@/pages/TestPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/test" element={<TestPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/dietary-info" element={<DietaryInfoPage />} />
                        <Route path="/inventory" element={<InventoryPage />} />
                        <Route path="/storage-locations" element={<StorageLocationsPage />} />
                        <Route path="/recipes" element={<RecipesPage />} />
                        <Route path="/meal-planner" element={<MealPlannerPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
