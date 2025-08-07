import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { InventoryItem, StorageLocation } from "@/types/inventory";
import { Product } from "@/types/product";

const inventorySchema = z.object({
  product_id: z.number().min(1, "Product is required"),
  quantity: z.number().min(0.1, "Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  price: z.number().min(0, "Price must be non-negative"),
  storage_location_id: z.number().min(1, "Storage location is required"),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  inventoryItem?: InventoryItem;
  products: Product[];
  storageLocations: StorageLocation[];
  onSubmit: (data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export function InventoryForm({ inventoryItem, products, storageLocations, onSubmit, onCancel }: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: inventoryItem ? {
      product_id: inventoryItem.product_id,
      quantity: inventoryItem.quantity,
      unit: inventoryItem.unit,
      expiry_date: inventoryItem.expiry_date,
      price: inventoryItem.price,
      storage_location_id: inventoryItem.storage_location_id,
    } : {
      quantity: 1,
      unit: "pieces",
      price: 0,
    },
  });

  const handleFormSubmit = (data: InventoryFormData) => {
    onSubmit(data);
  };

  const selectedProduct = products.find(p => p.id === watch("product_id"));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product *</Label>
              <Select
                value={watch("product_id")?.toString() || ""}
                onValueChange={(value) => setValue("product_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - {product.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product_id && (
                <p className="text-sm text-destructive">{errors.product_id.message}</p>
              )}
            </div>

            {selectedProduct && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">{selectedProduct.name}</div>
                <div className="text-sm text-muted-foreground">
                  Brand: {selectedProduct.brand} | Category: {selectedProduct.packaging_type}
                </div>
                <div className="text-sm text-muted-foreground">
                  Shelf Life: {selectedProduct.shelf_life} days
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quantity and Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Quantity & Storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  {...register("quantity", { valueAsNumber: true })}
                  placeholder="1"
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <Input
                  id="unit"
                  {...register("unit")}
                  placeholder="pieces, kg, liters"
                />
                {errors.unit && (
                  <p className="text-sm text-destructive">{errors.unit.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage_location">Storage Location *</Label>
              <Select
                value={watch("storage_location_id")?.toString() || ""}
                onValueChange={(value) => setValue("storage_location_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select storage location" />
                </SelectTrigger>
                <SelectContent>
                  {storageLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name} ({location.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.storage_location_id && (
                <p className="text-sm text-destructive">{errors.storage_location_id.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiry and Price */}
      <Card>
        <CardHeader>
          <CardTitle>Expiry & Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date *</Label>
              <Input
                id="expiry_date"
                type="date"
                {...register("expiry_date")}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.expiry_date && (
                <p className="text-sm text-destructive">{errors.expiry_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Unit *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
          </div>

          {watch("quantity") && watch("price") && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">
                Total Value: ${(watch("quantity") * watch("price")).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {watch("quantity")} {watch("unit")} × ${watch("price")} per unit
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : inventoryItem ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
} 