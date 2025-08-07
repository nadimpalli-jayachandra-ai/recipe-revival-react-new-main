import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Product, ProductCategory } from "@/types/product";
import { DietaryInformation } from "@/types/dietary";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  barcode: z.string().min(1, "Barcode is required"),
  packaging_type: z.string().min(1, "Packaging type is required"),
  shelf_life: z.number().min(1, "Shelf life must be at least 1 day"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  category_id: z.number().min(1, "Category is required"),
  dietary_info_ids: z.array(z.number()),
  calories: z.number().min(0, "Calories must be non-negative"),
  protein: z.number().min(0, "Protein must be non-negative"),
  fat: z.number().min(0, "Fat must be non-negative"),
  carbohydrates: z.number().min(0, "Carbohydrates must be non-negative"),
  is_vegan: z.boolean(),
  is_gluten_free: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: ProductCategory[];
  dietaryInfo: DietaryInformation[];
  onSubmit: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export function ProductForm({ product, categories, dietaryInfo, onSubmit, onCancel }: ProductFormProps) {
  const [selectedDietaryIds, setSelectedDietaryIds] = useState<number[]>(
    product?.dietary_info_ids || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      brand: product.brand,
      barcode: product.barcode,
      packaging_type: product.packaging_type,
      shelf_life: product.shelf_life,
      manufacturer: product.manufacturer,
      category_id: product.category_id,
      dietary_info_ids: product.dietary_info_ids,
      calories: product.calories,
      protein: product.protein,
      fat: product.fat,
      carbohydrates: product.carbohydrates,
      is_vegan: product.is_vegan,
      is_gluten_free: product.is_gluten_free,
    } : {
      dietary_info_ids: [],
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
      is_vegan: false,
      is_gluten_free: false,
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

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit({
      ...data,
      dietary_info_ids: selectedDietaryIds,
    });
  };

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
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                {...register("brand")}
                placeholder="Enter brand name"
              />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode *</Label>
              <Input
                id="barcode"
                {...register("barcode")}
                placeholder="Enter barcode"
              />
              {errors.barcode && (
                <p className="text-sm text-destructive">{errors.barcode.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer *</Label>
              <Input
                id="manufacturer"
                {...register("manufacturer")}
                placeholder="Enter manufacturer"
              />
              {errors.manufacturer && (
                <p className="text-sm text-destructive">{errors.manufacturer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="packaging_type">Packaging Type *</Label>
              <Input
                id="packaging_type"
                {...register("packaging_type")}
                placeholder="e.g., Plastic Bottle, Cardboard Box"
              />
              {errors.packaging_type && (
                <p className="text-sm text-destructive">{errors.packaging_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shelf_life">Shelf Life (days) *</Label>
              <Input
                id="shelf_life"
                type="number"
                {...register("shelf_life", { valueAsNumber: true })}
                placeholder="Enter shelf life in days"
              />
              {errors.shelf_life && (
                <p className="text-sm text-destructive">{errors.shelf_life.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={watch("category_id")?.toString() || ""}
                onValueChange={(value) => setValue("category_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-destructive">{errors.category_id.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Nutritional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  {...register("calories", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.calories && (
                  <p className="text-sm text-destructive">{errors.calories.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g) *</Label>
                <Input
                  id="protein"
                  type="number"
                  step="0.1"
                  {...register("protein", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.protein && (
                  <p className="text-sm text-destructive">{errors.protein.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g) *</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  {...register("fat", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.fat && (
                  <p className="text-sm text-destructive">{errors.fat.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbohydrates">Carbohydrates (g) *</Label>
                <Input
                  id="carbohydrates"
                  type="number"
                  step="0.1"
                  {...register("carbohydrates", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.carbohydrates && (
                  <p className="text-sm text-destructive">{errors.carbohydrates.message}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Dietary Properties</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_vegan"
                  checked={watch("is_vegan")}
                  onCheckedChange={(checked) => setValue("is_vegan", checked as boolean)}
                />
                <Label htmlFor="is_vegan">Vegan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_gluten_free"
                  checked={watch("is_gluten_free")}
                  onCheckedChange={(checked) => setValue("is_gluten_free", checked as boolean)}
                />
                <Label htmlFor="is_gluten_free">Gluten Free</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
} 