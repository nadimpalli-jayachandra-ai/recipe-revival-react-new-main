import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Plus, Clock, Users, ChefHat, ShoppingCart, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge as BadgeUI } from "@/components/ui/badge";

import { mockMealPlannerService } from "@/services/mockMealPlannerService";
import { mockRecipeService } from "@/services/mockRecipeService";
import { Menu, MenuMeal, MealType } from "@/types/menu";
import { Recipe } from "@/types/recipe";

const MEAL_TYPES: { value: MealType; label: string; color: string }[] = [
  { value: "BREAKFAST", label: "Breakfast", color: "bg-orange-100 text-orange-800" },
  { value: "BRUNCH", label: "Brunch", color: "bg-yellow-100 text-yellow-800" },
  { value: "SNACK1", label: "Morning Snack", color: "bg-green-100 text-green-800" },
  { value: "LUNCH", label: "Lunch", color: "bg-blue-100 text-blue-800" },
  { value: "SNACK2", label: "Afternoon Snack", color: "bg-purple-100 text-purple-800" },
  { value: "SUPPER", label: "Supper", color: "bg-red-100 text-red-800" },
  { value: "DINNER", label: "Dinner", color: "bg-indigo-100 text-indigo-800" },
];

const DAYS_OF_WEEK = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

export default function MealPlannerPage() {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [selectedMealType, setSelectedMealType] = useState<MealType>("BREAKFAST");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddMealDialogOpen, setIsAddMealDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const queryClient = useQueryClient();

  // Get current week's start (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(selectedWeek);

  // Queries
  const { data: weeklyMenu, isLoading: menuLoading } = useQuery({
    queryKey: ["weeklyMenu", weekStart.toISOString().split('T')[0]],
    queryFn: () => mockMealPlannerService.getWeeklyMenu(weekStart),
  });

  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: mockRecipeService.getRecipes,
  });

  // Mutations
  const addMealMutation = useMutation({
    mutationFn: ({ menuId, mealType, recipeId }: { menuId: number; mealType: MealType; recipeId: number }) =>
      mockMealPlannerService.addMealToMenu(menuId, mealType, recipeId),
    onMutate: async ({ menuId, mealType, recipeId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["weeklyMenu", weekStart.toISOString().split('T')[0]] });
      
      // Snapshot the previous value
      const previousWeeklyMenu = queryClient.getQueryData(["weeklyMenu", weekStart.toISOString().split('T')[0]]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["weeklyMenu", weekStart.toISOString().split('T')[0]], (old: any) => {
        if (!old) return old;
        return old.map((menu: any) => {
          if (menu.id === menuId) {
            return {
              ...menu,
              meals: [...(menu.meals || []), { id: Date.now(), menu_id: menuId, meal_type: mealType, recipe_id: recipeId }]
            };
          }
          return menu;
        });
      });
      
      return { previousWeeklyMenu };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWeeklyMenu) {
        queryClient.setQueryData(["weeklyMenu", weekStart.toISOString().split('T')[0]], context.previousWeeklyMenu);
      }
      toast.error("Failed to add meal to plan");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["weeklyMenu", weekStart.toISOString().split('T')[0]] });
    },
    onSuccess: () => {
      toast.success("Meal added to plan successfully");
      setIsAddMealDialogOpen(false);
    },
  });

  const removeMealMutation = useMutation({
    mutationFn: ({ menuId, mealType }: { menuId: number; mealType: MealType }) =>
      mockMealPlannerService.removeMealFromMenu(menuId, mealType),
    onMutate: async ({ menuId, mealType }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["weeklyMenu", weekStart.toISOString().split('T')[0]] });
      
      // Snapshot the previous value
      const previousWeeklyMenu = queryClient.getQueryData(["weeklyMenu", weekStart.toISOString().split('T')[0]]);
      
      // Optimistically update to the new value
      queryClient.setQueryData(["weeklyMenu", weekStart.toISOString().split('T')[0]], (old: any) => {
        if (!old) return old;
        return old.map((menu: any) => {
          if (menu.id === menuId) {
            return {
              ...menu,
              meals: (menu.meals || []).filter((meal: any) => meal.meal_type !== mealType)
            };
          }
          return menu;
        });
      });
      
      return { previousWeeklyMenu };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWeeklyMenu) {
        queryClient.setQueryData(["weeklyMenu", weekStart.toISOString().split('T')[0]], context.previousWeeklyMenu);
      }
      toast.error("Failed to remove meal from plan");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["weeklyMenu", weekStart.toISOString().split('T')[0]] });
    },
    onSuccess: () => {
      toast.success("Meal removed from plan");
    },
  });

  const generateShoppingListMutation = useMutation({
    mutationFn: (weekStart: Date) => mockMealPlannerService.generateShoppingList(weekStart),
    onSuccess: (shoppingList) => {
      toast.success("Shopping list generated!");
      console.log("Shopping List:", shoppingList);
    },
    onError: () => {
      toast.error("Failed to generate shopping list");
    },
  });

  const handleAddMeal = (date: string, mealType: MealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setSelectedRecipe(null); // Reset selected recipe
    setIsAddMealDialogOpen(true);
  };

  const handleConfirmAddMeal = () => {
    if (selectedRecipe && selectedDate) {
      const menu = weeklyMenu?.find(m => m.date === selectedDate);
      if (menu) {
        addMealMutation.mutate({
          menuId: menu.id,
          mealType: selectedMealType,
          recipeId: selectedRecipe.id,
        });
      }
    }
  };

  const handleRemoveMeal = (menuId: number, mealType: MealType) => {
    removeMealMutation.mutate({ menuId, mealType });
  };

  const handleGenerateShoppingList = () => {
    generateShoppingListMutation.mutate(weekStart);
  };

  const getMealForDay = (date: string, mealType: MealType) => {
    const menu = weeklyMenu?.find(m => m.date === date);
    if (!menu) return null;

    const meal = menu.meals?.find(m => m.meal_type === mealType);
    if (!meal) return null;

    return recipes.find(r => r.id === meal.recipe_id);
  };

  const getDayName = (date: Date) => {
    return DAYS_OF_WEEK[date.getDay()];
  };

  const getFormattedDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  if (menuLoading || recipesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading meal planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meal Planner</h1>
          <p className="text-muted-foreground">
            Plan your weekly meals and generate shopping lists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleGenerateShoppingList}
            disabled={generateShoppingListMutation.isPending}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {generateShoppingListMutation.isPending ? "Generating..." : "Generate Shopping List"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
          >
            Previous Week
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedWeek(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
          >
            Next Week
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Week of {weekStart.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric' 
              })}
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setSelectedWeek(new Date())}
            >
              Today
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Weekly Calendar */}
      <div className="grid grid-cols-8 gap-4">
        {/* Time column */}
        <div className="space-y-2">
          <div className="h-12"></div> {/* Header spacer */}
          {MEAL_TYPES.map((mealType) => (
            <div key={mealType.value} className="h-20 flex items-center justify-center">
              <BadgeUI className={mealType.color}>
                {mealType.label}
              </BadgeUI>
            </div>
          ))}
        </div>

        {/* Days of the week */}
        {weekDates.map((date) => {
          const dateString = getFormattedDate(date);
          const isToday = getFormattedDate(new Date()) === dateString;
          
          return (
            <div key={dateString} className="space-y-2">
              {/* Day header */}
              <div className={`h-12 flex flex-col items-center justify-center p-2 rounded-lg ${
                isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <div className="text-sm font-medium">{getDayName(date)}</div>
                <div className="text-xs">{date.getDate()}</div>
              </div>

              {/* Meal slots */}
              {MEAL_TYPES.map((mealType) => {
                const recipe = getMealForDay(dateString, mealType.value);
                const menu = weeklyMenu?.find(m => m.date === dateString);
                
                return (
                  <div key={mealType.value} className="h-20 border rounded-lg p-2 relative">
                    {recipe ? (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">
                              {recipe.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {recipe.cook_time_minutes}min
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => menu && handleRemoveMeal(menu.id, mealType.value)}
                          >
                            ×
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {recipe.dietary_info_ids.slice(0, 2).map((dietaryId) => (
                            <Badge key={dietaryId} variant="secondary" className="text-xs px-1 py-0">
                              {dietaryId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        className="w-full h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                        onClick={() => handleAddMeal(dateString, mealType.value)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Add Meal Dialog */}
      <Dialog open={isAddMealDialogOpen} onOpenChange={setIsAddMealDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Meal to Plan</DialogTitle>
            <DialogDescription>
              Select a recipe to add to your meal plan for {selectedDate} - {MEAL_TYPES.find(m => m.value === selectedMealType)?.label}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {recipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedRecipe?.id === recipe.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{recipe.name}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.cook_time_minutes}min
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {recipe.servings}
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat className="h-3 w-3" />
                        {recipe.difficulty_level}
                      </div>
                    </div>
                    {recipe.total_calories && (
                      <div className="mt-2 text-xs">
                        {recipe.total_calories} cal
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddMealDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAddMeal}
                disabled={!selectedRecipe || addMealMutation.isPending}
              >
                {addMealMutation.isPending ? "Adding..." : "Add Meal"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 