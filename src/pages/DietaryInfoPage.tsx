import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { DietaryInformation, DietaryType } from "@/types/dietary";
import { mockDietaryService } from "@/services/mockDietaryService";

export default function DietaryInfoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDietaryInfo, setSelectedDietaryInfo] = useState<DietaryInformation | null>(null);

  const queryClient = useQueryClient();

  const { data: dietaryInfo, isLoading } = useQuery({
    queryKey: ["dietaryInfo"],
    queryFn: mockDietaryService.getDietaryInformation,
  });

  const createMutation = useMutation({
    mutationFn: mockDietaryService.createDietaryInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dietaryInfo"] });
      toast.success("Dietary information created successfully");
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to create dietary information");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<DietaryInformation>) => 
      mockDietaryService.updateDietaryInfo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dietaryInfo"] });
      toast.success("Dietary information updated successfully");
      setIsEditDialogOpen(false);
      setSelectedDietaryInfo(null);
    },
    onError: () => {
      toast.error("Failed to update dietary information");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: mockDietaryService.deleteDietaryInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dietaryInfo"] });
      toast.success("Dietary information deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete dietary information");
    },
  });

  const filteredDietaryInfo = dietaryInfo?.filter((info) => {
    const matchesSearch = info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         info.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || info.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleEdit = (dietaryInfo: DietaryInformation) => {
    setSelectedDietaryInfo(dietaryInfo);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this dietary information?")) {
      deleteMutation.mutate(id);
    }
  };

  const dietaryTypeOptions: { value: DietaryType; label: string }[] = [
    { value: "ALLERGEN", label: "Allergen" },
    { value: "DIETARY_RESTRICTION", label: "Dietary Restriction" },
    { value: "NUTRITIONAL_CATEGORY", label: "Nutritional Category" },
    { value: "CERTIFICATION", label: "Certification" },
    { value: "INGREDIENT_GROUP", label: "Ingredient Group" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dietary Information</h1>
            <p className="text-muted-foreground">
              Manage dietary tags, allergens, and nutritional categories
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dietary information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dietary Information</h1>
          <p className="text-muted-foreground">
            Manage dietary tags, allergens, and nutritional categories
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Dietary Info
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Dietary Information</DialogTitle>
              <DialogDescription>
                Create a new dietary tag, allergen, or nutritional category.
              </DialogDescription>
            </DialogHeader>
            <DietaryInfoForm
              onSubmit={(data) => createMutation.mutate(data)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dietary Information</CardTitle>
          <CardDescription>
            Manage all dietary tags, allergens, and nutritional categories used across products and recipes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search dietary information..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {dietaryTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDietaryInfo?.map((info) => (
                  <TableRow key={info.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: info.color_code }}
                        />
                        {info.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {dietaryTypeOptions.find(opt => opt.value === info.type)?.label || info.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {info.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={info.is_active ? "default" : "secondary"}>
                        {info.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(info)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(info.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDietaryInfo?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No dietary information found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Dietary Information</DialogTitle>
            <DialogDescription>
              Update the dietary information details.
            </DialogDescription>
          </DialogHeader>
          {selectedDietaryInfo && (
                         <DietaryInfoForm
               initialData={selectedDietaryInfo}
               onSubmit={(data) => updateMutation.mutate({ id: selectedDietaryInfo!.id, ...data })}
               isLoading={updateMutation.isPending}
             />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface DietaryInfoFormProps {
  initialData?: DietaryInformation;
  onSubmit: (data: Omit<DietaryInformation, "id" | "created_at" | "updated_at">) => void;
  isLoading: boolean;
}

function DietaryInfoForm({ initialData, onSubmit, isLoading }: DietaryInfoFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "DIETARY_RESTRICTION" as DietaryType,
    icon_url: initialData?.icon_url || "",
    color_code: initialData?.color_code || "#3B82F6",
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Gluten-Free, Vegan, Nut-Free"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this dietary information..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as DietaryType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALLERGEN">Allergen</SelectItem>
            <SelectItem value="DIETARY_RESTRICTION">Dietary Restriction</SelectItem>
            <SelectItem value="NUTRITIONAL_CATEGORY">Nutritional Category</SelectItem>
            <SelectItem value="CERTIFICATION">Certification</SelectItem>
            <SelectItem value="INGREDIENT_GROUP">Ingredient Group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon_url">Icon URL</Label>
        <Input
          id="icon_url"
          value={formData.icon_url}
          onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
          placeholder="https://example.com/icon.png"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color_code">Color Code</Label>
        <div className="flex items-center gap-2">
          <Input
            id="color_code"
            value={formData.color_code}
            onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
            placeholder="#3B82F6"
            className="flex-1"
          />
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: formData.color_code }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
} 