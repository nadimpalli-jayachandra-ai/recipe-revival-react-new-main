import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Product, ProductCategory } from "@/types/product";
import { DietaryInformation } from "@/types/dietary";

interface ProductDetailDialogProps {
  product: Product;
  category?: ProductCategory;
  dietaryInfo: DietaryInformation[];
  onClose: () => void;
}

export function ProductDetailDialog({ product, category, dietaryInfo, onClose }: ProductDetailDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Product Details</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product Name</label>
                  <p className="text-lg font-semibold">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Brand</label>
                  <p className="text-lg">{product.brand}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-lg">{category?.name || "Unknown"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
                  <p className="text-lg">{product.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Packaging Type</label>
                  <p className="text-lg">{product.packaging_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Shelf Life</label>
                  <p className="text-lg">{product.shelf_life} days</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Barcode</label>
                  <p className="text-lg font-mono">{product.barcode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutritional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Nutritional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{product.calories}</div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{product.protein}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{product.fat}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{product.carbohydrates}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dietary Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Dietary Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.is_vegan && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    🌱 Vegan
                  </Badge>
                )}
                {product.is_gluten_free && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    🌾 Gluten Free
                  </Badge>
                )}
                {!product.is_vegan && !product.is_gluten_free && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    Standard
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

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

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">Product ID</label>
                  <p className="font-mono">{product.id}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Created</label>
                  <p>{new Date(product.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">Last Updated</label>
                  <p>{new Date(product.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
} 