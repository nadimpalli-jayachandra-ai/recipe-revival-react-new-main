import { useState, useEffect } from 'react';
import { mockRecipeService } from '@/services/mockRecipeService';
import { Recipe } from '@/types/recipe';

function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // This is where you call the mock service
    async function fetchRecipes() {
      try {
        const data = await mockRecipeService.getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recipe List</h2>
      {recipes.length === 0 ? (
        <p className="text-muted-foreground">No recipes found.</p>
      ) : (
        <ul className="space-y-2">
          {recipes.map(recipe => (
            <li key={recipe.id} className="p-4 border rounded-lg hover:bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{recipe.name}</h3>
                  <p className="text-sm text-muted-foreground">{recipe.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {recipe.difficulty_level}
                    </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {recipe.cook_time_minutes}min cook
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                      {recipe.prep_time_minutes}min prep
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>Serves: {recipe.servings}</div>
                  {recipe.total_calories && (
                    <div>{recipe.total_calories} cal</div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecipeList; 