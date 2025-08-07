
import { useQuery } from "@tanstack/react-query";
import { 
  Package, 
  Archive, 
  ChefHat, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Clock,
  Plus,
  Search,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { mockProductService } from "@/services/mockProductService";
import { mockInventoryService } from "@/services/mockInventoryService";
import { mockRecipeService } from "@/services/mockRecipeService";
import { mockDietaryService } from "@/services/mockDietaryService";

export default function DashboardPage() {
  // Queries for dashboard data
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: mockProductService.getProducts,
  });

  const { data: inventoryItems = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: mockInventoryService.getInventoryItems,
  });

  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: mockRecipeService.getRecipes,
  });

  const { data: expiringItems = [] } = useQuery({
    queryKey: ["expiring-items"],
    queryFn: () => mockInventoryService.getExpiringItems(7),
  });

  const { data: lowStockItems = [] } = useQuery({
    queryKey: ["low-stock-items"],
    queryFn: () => mockInventoryService.getLowStockItems(2),
  });

  if (productsLoading || inventoryLoading || recipesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCookTime = recipes.reduce((sum, recipe) => sum + recipe.cook_time_minutes, 0);
  const averageServings = recipes.length > 0 
    ? Math.round(recipes.reduce((sum, recipe) => sum + recipe.servings, 0) / recipes.length)
    : 0;

  const quickActions = [
    {
      title: "Add Product",
      description: "Add a new product to your catalog",
      icon: Package,
      href: "/products",
      color: "bg-blue-500",
    },
    {
      title: "Add Inventory",
      description: "Add items to your inventory",
      icon: Archive,
      href: "/inventory",
      color: "bg-green-500",
    },
    {
      title: "Create Recipe",
      description: "Create a new recipe",
      icon: ChefHat,
      href: "/recipes",
      color: "bg-orange-500",
    },
    {
      title: "Plan Meals",
      description: "Plan your weekly meals",
      icon: Calendar,
      href: "/meal-planner",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your KitchenBrain dashboard. Manage your kitchen efficiently.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Products in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total inventory value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.length}</div>
            <p className="text-xs text-muted-foreground">
              Recipes in collection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Servings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageServings}</div>
            <p className="text-xs text-muted-foreground">
              Average servings per recipe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to help you manage your kitchen efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Warnings */}
      {(expiringItems.length > 0 || lowStockItems.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alerts & Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expiringItems.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">
                      {expiringItems.length} items expiring soon
                    </span>
                  </div>
                  <Link to="/inventory">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              )}
              
              {lowStockItems.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">
                      {lowStockItems.length} items low in stock
                    </span>
                  </div>
                  <Link to="/inventory">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>
              Latest products added to your catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.brand}</div>
                  </div>
                  <Badge variant="secondary">{product.calories} cal</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/products">
                <Button variant="outline" size="sm" className="w-full">
                  View All Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Recipes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Recipes</CardTitle>
            <CardDescription>
              Latest recipes in your collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recipes.slice(0, 5).map((recipe) => (
                <div key={recipe.id} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div>
                    <div className="font-medium">{recipe.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {recipe.cook_time_minutes} min cook • {recipe.servings} servings
                    </div>
                  </div>
                  <Badge variant="secondary">{recipe.difficulty_level}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/recipes">
                <Button variant="outline" size="sm" className="w-full">
                  View All Recipes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kitchen Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Kitchen Statistics</CardTitle>
          <CardDescription>
            Overview of your kitchen management metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{products.length}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{inventoryItems.length}</div>
              <div className="text-sm text-muted-foreground">Inventory Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{recipes.length}</div>
              <div className="text-sm text-muted-foreground">Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalCookTime}</div>
              <div className="text-sm text-muted-foreground">Total Cook Time (min)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
