import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Calculator } from "lucide-react";
import { mockRecipeService } from "@/services/mockRecipeService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Recipe, RecipeProduct } from "@/types/recipe";
import { Product } from "@/types/product";
import { DietaryInformation } from "@/types/dietary";

const recipeSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().min(1, "Description is required"),
  instructions: z.string().min(1, "Instructions are required"),
  cook_time_minutes: z.number().min(1, "Cook time must be at least 1 minute"),
  prep_time_minutes: z.number().min(0, "Prep time must be non-negative"),
  servings: z.number().min(1, "Servings must be at least 1"),
  difficulty_level: z.enum(["EASY", "MEDIUM", "HARD"]),
  dietary_info_ids: z.array(z.number()),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeFormProps {
  recipe?: Recipe;
  products: Product[];
  dietaryInfo: DietaryInformation[];
  onSubmit: (data: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>, ingredients: Array<{product_id: number; quantity: number; unit: string}>) => void;
  onCancel: () => void;
}

export function RecipeForm({ recipe, products, dietaryInfo, onSubmit, onCancel }: RecipeFormProps) {
  const [selectedDietaryIds, setSelectedDietaryIds] = useState<number[]>(
    recipe?.dietary_info_ids || []
  );
  const [ingredients, setIngredients] = useState<Array<{
    product_id: number;
    quantity: number;
    unit: string;
  }>>(recipe ? [] : []); // Will be populated from recipe products
  const [newIngredient, setNewIngredient] = useState({
    product_id: 0,
    quantity: 1,
    unit: "pieces",
  });

  // Load existing ingredients when editing a recipe
  useEffect(() => {
    if (recipe) {
      const loadIngredients = async () => {
        try {
          const recipeProducts = await mockRecipeService.getRecipeProducts(recipe.id);
          const ingredientsData = recipeProducts.map(rp => ({
            product_id: rp.product_id,
            quantity: rp.quantity,
            unit: rp.unit,
          }));
          setIngredients(ingredientsData);
        } catch (error) {
          console.error('Error loading recipe ingredients:', error);
        }
      };
      loadIngredients();
    }
  }, [recipe]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: recipe ? {
      name: recipe.name,
      description: recipe.description,
      instructions: recipe.instructions,
      cook_time_minutes: recipe.cook_time_minutes,
      prep_time_minutes: recipe.prep_time_minutes,
      servings: recipe.servings,
      difficulty_level: recipe.difficulty_level,
      dietary_info_ids: recipe.dietary_info_ids,
    } : {
      cook_time_minutes: 30,
      prep_time_minutes: 15,
      servings: 4,
      difficulty_level: "EASY",
      dietary_info_ids: [],
    },
  });

  const handleDietaryToggle = (dietaryId: number) => {
    setSelectedDietaryIds(prev => {
      const newIds = prev.includes(dietaryId)
        ? prev.filter(id => id !== dietaryId)
        : [...prev, dietaryId];
      setValue('dietary_info_ids', newIds);
      return newIds;
    });
  };

  const addIngredient = () => {
    if (newIngredient.product_id && newIngredient.quantity > 0) {
      setIngredients([...ingredients, { ...newIngredient }]);
      setNewIngredient({ product_id: 0, quantity: 1, unit: "pieces" });
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const calculateNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbohydrates = 0;

    ingredients.forEach(ingredient => {
      const product = products.find(p => p.id === ingredient.product_id);
      if (product) {
        // Simple calculation based on quantity (assuming 1 unit = 1 serving of product)
        const multiplier = ingredient.quantity;
        totalCalories += product.calories * multiplier;
        totalProtein += product.protein * multiplier;
        totalFat += product.fat * multiplier;
        totalCarbohydrates += product.carbohydrates * multiplier;
      }
    });

    return { totalCalories, totalProtein, totalFat, totalCarbohydrates };
  };

  const handleFormSubmit = (data: RecipeFormData) => {
    const nutrition = calculateNutrition();
    onSubmit({
      ...data,
      dietary_info_ids: selectedDietaryIds,
      total_calories: Math.round(nutrition.totalCalories),
      total_protein: Math.round(nutrition.totalProtein * 10) / 10,
      total_fat: Math.round(nutrition.totalFat * 10) / 10,
      total_carbohydrates: Math.round(nutrition.totalCarbohydrates * 10) / 10,
    }, ingredients);
  };

  const nutrition = calculateNutrition();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Recipe Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter recipe name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Brief description of the recipe"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cook_time">Cook Time (min) *</Label>
                <Input
                  id="cook_time"
                  type="number"
                  {...register("cook_time_minutes", { valueAsNumber: true })}
                  placeholder="30"
                />
                {errors.cook_time_minutes && (
                  <p className="text-sm text-destructive">{errors.cook_time_minutes.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prep_time">Prep Time (min)</Label>
                <Input
                  id="prep_time"
                  type="number"
                  {...register("prep_time_minutes", { valueAsNumber: true })}
                  placeholder="15"
                />
                {errors.prep_time_minutes && (
                  <p className="text-sm text-destructive">{errors.prep_time_minutes.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Servings *</Label>
                <Input
                  id="servings"
                  type="number"
                  {...register("servings", { valueAsNumber: true })}
                  placeholder="4"
                />
                {errors.servings && (
                  <p className="text-sm text-destructive">{errors.servings.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level *</Label>
              <Select
                value={watch("difficulty_level")}
                onValueChange={(value) => setValue("difficulty_level", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty_level && (
                <p className="text-sm text-destructive">{errors.difficulty_level.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Ingredient */}
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={newIngredient.product_id.toString()}
                onValueChange={(value) => setNewIngredient({
                  ...newIngredient,
                  product_id: parseInt(value)
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                step="0.1"
                placeholder="Quantity"
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient({
                  ...newIngredient,
                  quantity: parseFloat(e.target.value) || 0
                })}
              />

              <div className="flex gap-2">
                <Input
                  placeholder="Unit"
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({
                    ...newIngredient,
                    unit: e.target.value
                  })}
                />
                <Button type="button" size="sm" onClick={addIngredient}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => {
                const product = products.find(p => p.id === ingredient.product_id);
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">
                      {product?.name} - {ingredient.quantity} {ingredient.unit}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Nutritional Summary */}
            {ingredients.length > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4" />
                  <span className="font-medium">Nutritional Summary</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{Math.round(nutrition.totalCalories)}</div>
                    <div className="text-muted-foreground">cal</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{Math.round(nutrition.totalProtein * 10) / 10}g</div>
                    <div className="text-muted-foreground">protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{Math.round(nutrition.totalFat * 10) / 10}g</div>
                    <div className="text-muted-foreground">fat</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{Math.round(nutrition.totalCarbohydrates * 10) / 10}g</div>
                    <div className="text-muted-foreground">carbs</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="instructions">Step-by-step instructions *</Label>
            <Textarea
              id="instructions"
              {...register("instructions")}
              placeholder="Enter detailed cooking instructions..."
              rows={8}
            />
            {errors.instructions && (
              <p className="text-sm text-destructive">{errors.instructions.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dietary Information */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dietaryInfo.map((dietary) => (
              <div key={dietary.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`dietary-${dietary.id}`}
                  checked={selectedDietaryIds.includes(dietary.id)}
                  onCheckedChange={() => handleDietaryToggle(dietary.id)}
                />
                <Label htmlFor={`dietary-${dietary.id}`} className="flex items-center space-x-2">
                  <span>{dietary.icon_url}</span>
                  <span>{dietary.name}</span>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : recipe ? "Update Recipe" : "Create Recipe"}
        </Button>
      </div>
    </form>
  );
} 