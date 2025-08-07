import { X, Clock, Users, ChefHat, Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Recipe } from "@/types/recipe";
import { Product } from "@/types/product";
import { DietaryInformation } from "@/types/dietary";

interface RecipeDetailDialogProps {
  recipe: Recipe;
  products: Product[];
  dietaryInfo: DietaryInformation[];
  onClose: () => void;
}

export function RecipeDetailDialog({ recipe, products, dietaryInfo, onClose }: RecipeDetailDialogProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Recipe Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipe Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{recipe.name}</CardTitle>
                  <p className="text-muted-foreground">{recipe.description}</p>
                </div>
                <Badge className={getDifficultyColor(recipe.difficulty_level)}>
                  {recipe.difficulty_level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{recipe.cook_time_minutes} min</div>
                    <div className="text-sm text-muted-foreground">Cook time</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{recipe.prep_time_minutes} min</div>
                    <div className="text-sm text-muted-foreground">Prep time</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{recipe.servings}</div>
                    <div className="text-sm text-muted-foreground">Servings</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{recipe.difficulty_level}</div>
                    <div className="text-sm text-muted-foreground">Difficulty</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutritional Information */}
          {recipe.total_calories && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Nutritional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{recipe.total_calories}</div>
                    <div className="text-sm text-muted-foreground">Calories</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{recipe.total_protein}g</div>
                    <div className="text-sm text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{recipe.total_fat}g</div>
                    <div className="text-sm text-muted-foreground">Fat</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">{recipe.total_carbohydrates}g</div>
                    <div className="text-sm text-muted-foreground">Carbohydrates</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dietary Information */}
          {dietaryInfo.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dietary Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dietaryInfo.map((dietary) => (
                    <Badge key={dietary.id} variant="outline" className="flex items-center gap-1">
                      <span>{dietary.icon_url}</span>
                      <span>{dietary.name}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {recipe.instructions.split('\n').map((step, index) => (
                  <div key={index} className="mb-2">
                    {step}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Recipe ID</label>
                  <p className="font-mono">{recipe.id}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Created</label>
                  <p>{new Date(recipe.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Last Updated</label>
                  <p>{new Date(recipe.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 