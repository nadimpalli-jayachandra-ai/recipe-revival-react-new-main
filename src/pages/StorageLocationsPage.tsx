import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, Edit, Trash2, Eye, Thermometer, Package, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { mockStorageService } from "@/services/mockStorageService";
import { StorageLocation } from "@/types/inventory";

const LOCATION_TYPES = [
  { value: "PANTRY", label: "Pantry" },
  { value: "REFRIGERATOR", label: "Refrigerator" },
  { value: "FREEZER", label: "Freezer" },
  { value: "CABINET", label: "Cabinet" },
  { value: "CELLAR", label: "Cellar" },
  { value: "SHELF", label: "Shelf" },
  { value: "DRAWER", label: "Drawer" },
];

const TEMPERATURE_ZONES = [
  { value: "ROOM_TEMPERATURE", label: "Room Temperature" },
  { value: "COLD", label: "Cold" },
  { value: "FROZEN", label: "Frozen" },
  { value: "COOL", label: "Cool" },
  { value: "WARM", label: "Warm" },
];

export default function StorageLocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedTemperature, setSelectedTemperature] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);

  const queryClient = useQueryClient();

  const { data: storageLocations = [], isLoading } = useQuery({
    queryKey: ["storageLocations"],
    queryFn: mockStorageService.getStorageLocations,
  });

  const createMutation = useMutation({
    mutationFn: mockStorageService.createStorageLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storageLocations"] });
      toast.success("Storage location created successfully");
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to create storage location");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<StorageLocation> }) =>
      mockStorageService.updateStorageLocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storageLocations"] });
      toast.success("Storage location updated successfully");
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update storage location");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: mockStorageService.deleteStorageLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storageLocations"] });
      toast.success("Storage location deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete storage location");
    },
  });

  const handleCreateLocation = (data: Omit<StorageLocation, 'id' | 'created_at' | 'updated_at'>) => {
    createMutation.mutate(data);
  };

  const handleUpdateLocation = (id: number, data: Partial<StorageLocation>) => {
    updateMutation.mutate({ id, data });
  };

  const handleDeleteLocation = (id: number) => {
    if (confirm("Are you sure you want to delete this storage location?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewLocation = (location: StorageLocation) => {
    setSelectedLocation(location);
    setIsViewDialogOpen(true);
  };

  const handleEditLocation = (location: StorageLocation) => {
    setSelectedLocation(location);
    setIsEditDialogOpen(true);
  };

  const filteredLocations = storageLocations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || location.location_type === selectedType;
    const matchesTemperature = !selectedTemperature || location.temperature_zone === selectedTemperature;
    
    return matchesSearch && matchesType && matchesTemperature;
  });

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "PANTRY": return "bg-orange-100 text-orange-800";
      case "REFRIGERATOR": return "bg-blue-100 text-blue-800";
      case "FREEZER": return "bg-cyan-100 text-cyan-800";
      case "CABINET": return "bg-yellow-100 text-yellow-800";
      case "CELLAR": return "bg-purple-100 text-purple-800";
      case "SHELF": return "bg-green-100 text-green-800";
      case "DRAWER": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTemperatureColor = (zone: string) => {
    switch (zone) {
      case "ROOM_TEMPERATURE": return "bg-green-100 text-green-800";
      case "COLD": return "bg-blue-100 text-blue-800";
      case "FROZEN": return "bg-cyan-100 text-cyan-800";
      case "COOL": return "bg-indigo-100 text-indigo-800";
      case "WARM": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading storage locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Storage Locations</h1>
          <p className="text-muted-foreground">
            Manage your kitchen storage locations and their properties
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Location Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {LOCATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature Zone</Label>
              <Select value={selectedTemperature} onValueChange={setSelectedTemperature}>
                <SelectTrigger>
                  <SelectValue placeholder="All zones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All zones</SelectItem>
                  {TEMPERATURE_ZONES.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("");
                  setSelectedTemperature("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Locations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Locations ({filteredLocations.length})</CardTitle>
          <CardDescription>
            Manage your kitchen storage locations and their properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {location.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLocationTypeColor(location.location_type)}>
                      {LOCATION_TYPES.find(t => t.value === location.location_type)?.label || location.location_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTemperatureColor(location.temperature_zone)}>
                      {TEMPERATURE_ZONES.find(z => z.value === location.temperature_zone)?.label || location.temperature_zone}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {location.capacity} items
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={location.is_active ? "default" : "secondary"}>
                      {location.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewLocation(location)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLocation(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLocation(location.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Storage Location Dialog */}
      <StorageLocationForm
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateLocation}
        isLoading={createMutation.isPending}
      />

      {/* Edit Storage Location Dialog */}
      {selectedLocation && (
        <StorageLocationForm
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          initialData={selectedLocation}
          onSubmit={(data) => handleUpdateLocation(selectedLocation.id, data)}
          isLoading={updateMutation.isPending}
        />
      )}

      {/* View Storage Location Dialog */}
      {selectedLocation && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {selectedLocation.name}
              </DialogTitle>
              <DialogDescription>
                Storage location details and properties
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedLocation.description}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location Type</Label>
                  <div className="mt-1">
                    <Badge className={getLocationTypeColor(selectedLocation.location_type)}>
                      {LOCATION_TYPES.find(t => t.value === selectedLocation.location_type)?.label || selectedLocation.location_type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Temperature Zone</Label>
                  <div className="mt-1">
                    <Badge className={getTemperatureColor(selectedLocation.temperature_zone)}>
                      {TEMPERATURE_ZONES.find(z => z.value === selectedLocation.temperature_zone)?.label || selectedLocation.temperature_zone}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Capacity</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedLocation.capacity} items
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedLocation.is_active ? "default" : "secondary"}>
                      {selectedLocation.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedLocation.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface StorageLocationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: StorageLocation;
  onSubmit: (data: Omit<StorageLocation, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

function StorageLocationForm({ open, onOpenChange, initialData, onSubmit, isLoading }: StorageLocationFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    location_type: initialData?.location_type || "PANTRY",
    capacity: initialData?.capacity || 50,
    temperature_zone: initialData?.temperature_zone || "ROOM_TEMPERATURE",
    is_active: initialData?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      name: initialData?.name || "",
      description: initialData?.description || "",
      location_type: initialData?.location_type || "PANTRY",
      capacity: initialData?.capacity || 50,
      temperature_zone: initialData?.temperature_zone || "ROOM_TEMPERATURE",
      is_active: initialData?.is_active ?? true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Storage Location" : "Create Storage Location"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the storage location details" : "Add a new storage location to your kitchen"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Kitchen Pantry"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_type">Location Type</Label>
              <Select value={formData.location_type} onValueChange={(value) => setFormData({ ...formData, location_type: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the storage location and its purpose..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (items)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature_zone">Temperature Zone</Label>
              <Select value={formData.temperature_zone} onValueChange={(value) => setFormData({ ...formData, temperature_zone: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPERATURE_ZONES.map((zone) => (
                    <SelectItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (initialData ? "Update" : "Create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 