import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Clock, Users, ChefHat, Edit, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { mockRecipeService } from "@/services/mockRecipeService";
import { mockProductService } from "@/services/mockProductService";
import { mockDietaryService } from "@/services/mockDietaryService";
import { Recipe } from "@/types/recipe";
import { Product } from "@/types/product";
import { DietaryInformation } from "@/types/dietary";

import { RecipeForm } from "@/components/forms/RecipeForm";
import { RecipeDetailDialog } from "@/components/dialogs/RecipeDetailDialog";

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedDietaryFilter, setSelectedDietaryFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: recipes = [], isLoading: recipesLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: mockRecipeService.getRecipes,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: mockProductService.getProducts,
  });

  const { data: dietaryInfo = [], isLoading: dietaryLoading } = useQuery({
    queryKey: ["dietary-info"],
    queryFn: mockDietaryService.getDietaryInformation,
  });

  // Mutations
  const createRecipeMutation = useMutation({
    mutationFn: ({ data, ingredients }: { data: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>; ingredients: Array<{product_id: number; quantity: number; unit: string}> }) => 
      mockRecipeService.createRecipe(data, ingredients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Recipe created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create recipe",
        variant: "destructive",
      });
    },
  });

    const updateRecipeMutation = useMutation({
    mutationFn: ({ id, data, ingredients }: { id: number; data: Partial<Recipe>; ingredients: Array<{product_id: number; quantity: number; unit: string}> }) => 
      mockRecipeService.updateRecipe(id, data, ingredients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setEditingRecipe(null);
      toast({
        title: "Success",
        description: "Recipe updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update recipe",
        variant: "destructive",
      });
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: mockRecipeService.deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete recipe",
        variant: "destructive",
      });
    },
  });

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || recipe.difficulty_level === selectedDifficulty;
    const matchesDietary = selectedDietaryFilter === "all" || 
                          recipe.dietary_info_ids.includes(parseInt(selectedDietaryFilter));
    
    return matchesSearch && matchesDifficulty && matchesDietary;
  });

  const getDietaryBadges = (dietaryIds: number[]) => {
    return dietaryIds.map(id => {
      const dietary = dietaryInfo.find(d => d.id === id);
      return dietary ? (
        <Badge key={dietary.id} variant="secondary" className="mr-1 mb-1">
          {dietary.icon_url} {dietary.name}
        </Badge>
      ) : null;
    }).filter(Boolean);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRecipe = (data: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>, ingredients: Array<{product_id: number; quantity: number; unit: string}>) => {
    createRecipeMutation.mutate({ data, ingredients });
  };

  const handleUpdateRecipe = (data: Partial<Recipe>, ingredients: Array<{product_id: number; quantity: number; unit: string}>) => {
    if (editingRecipe) {
      updateRecipeMutation.mutate({ id: editingRecipe.id, data, ingredients });
    }
  };

  const handleDeleteRecipe = (recipeId: number) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipeMutation.mutate(recipeId);
    }
  };

  if (recipesLoading || productsLoading || dietaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading recipes...</div>
      </div>
    );
  }

  const totalCookTime = recipes.reduce((sum, recipe) => sum + recipe.cook_time_minutes, 0);
  const totalPrepTime = recipes.reduce((sum, recipe) => sum + recipe.prep_time_minutes, 0);
  const averageServings = recipes.length > 0 
    ? Math.round(recipes.reduce((sum, recipe) => sum + recipe.servings, 0) / recipes.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
          <p className="text-muted-foreground">
            Create and manage your recipe collection with ingredients and instructions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Recipe</DialogTitle>
              <DialogDescription>
                Create a new recipe with ingredients, instructions, and nutritional information.
              </DialogDescription>
            </DialogHeader>
            <RecipeForm
              products={products}
              dietaryInfo={dietaryInfo}
              onSubmit={handleCreateRecipe}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Total Cook Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCookTime}</div>
            <p className="text-xs text-muted-foreground">
              Minutes of cooking time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prep Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrepTime}</div>
            <p className="text-xs text-muted-foreground">
              Minutes of prep time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Servings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageServings}</div>
            <p className="text-xs text-muted-foreground">
              Average servings per recipe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="EASY">Easy</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HARD">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDietaryFilter} onValueChange={setSelectedDietaryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select dietary filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dietary</SelectItem>
                {dietaryInfo.map((dietary) => (
                  <SelectItem key={dietary.id} value={dietary.id.toString()}>
                    {dietary.icon_url} {dietary.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingRecipe(recipe)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingRecipe(recipe)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recipe Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{recipe.cook_time_minutes} min cook</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(recipe.difficulty_level)}>
                  {recipe.difficulty_level}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {recipe.prep_time_minutes} min prep
                </div>
              </div>

              {/* Dietary Information */}
              <div className="flex flex-wrap gap-1">
                {getDietaryBadges(recipe.dietary_info_ids)}
              </div>

              {/* Nutritional Info */}
              {recipe.total_calories && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">{recipe.total_calories}</div>
                    <div className="text-muted-foreground">cal</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">{recipe.total_protein}g</div>
                    <div className="text-muted-foreground">protein</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-medium">{recipe.total_carbohydrates}g</div>
                    <div className="text-muted-foreground">carbs</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingRecipe && (
        <Dialog open={!!editingRecipe} onOpenChange={() => setEditingRecipe(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Recipe</DialogTitle>
              <DialogDescription>
                Update the recipe details, ingredients, and instructions.
              </DialogDescription>
            </DialogHeader>
            <RecipeForm
              recipe={editingRecipe}
              products={products}
              dietaryInfo={dietaryInfo}
              onSubmit={handleUpdateRecipe}
              onCancel={() => setEditingRecipe(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* View Dialog */}
      {viewingRecipe && (
        <RecipeDetailDialog
          recipe={viewingRecipe}
          products={products}
          dietaryInfo={dietaryInfo.filter(d => viewingRecipe.dietary_info_ids.includes(d.id))}
          onClose={() => setViewingRecipe(null)}
        />
      )}
    </div>
  );
} 