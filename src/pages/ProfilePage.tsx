import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Mail, Phone, Calendar, MapPin, ChefHat, Heart, Shield, Settings, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { mockDietaryService } from "@/services/mockDietaryService";
import { DietaryInformation } from "@/types/dietary";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  location?: string;
  bio?: string;
  dietary_preferences: number[];
  cooking_experience: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  household_size: number;
  notification_preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    meal_reminders: boolean;
    expiry_alerts: boolean;
  };
  created_at: string;
  updated_at: string;
}

const COOKING_EXPERIENCE_LEVELS = [
  { value: "BEGINNER", label: "Beginner", description: "Just starting to cook" },
  { value: "INTERMEDIATE", label: "Intermediate", description: "Some cooking experience" },
  { value: "ADVANCED", label: "Advanced", description: "Experienced cook" },
  { value: "EXPERT", label: "Expert", description: "Professional level cooking" },
];

const HOUSEHOLD_SIZES = [
  { value: 1, label: "1 person" },
  { value: 2, label: "2 people" },
  { value: 3, label: "3 people" },
  { value: 4, label: "4 people" },
  { value: 5, label: "5 people" },
  { value: 6, label: "6+ people" },
];

// Mock user profile data
const mockUserProfile: UserProfile = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  date_of_birth: "1990-05-15",
  location: "New York, NY",
  bio: "Passionate home cook who loves experimenting with new recipes and ingredients. Always looking to improve my culinary skills!",
  dietary_preferences: [1, 3, 5], // IDs of dietary preferences
  cooking_experience: "INTERMEDIATE",
  household_size: 3,
  notification_preferences: {
    email_notifications: true,
    push_notifications: true,
    meal_reminders: true,
    expiry_alerts: true,
  },
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [editForm, setEditForm] = useState<UserProfile>(mockUserProfile);

  const queryClient = useQueryClient();

  const { data: dietaryInfo = [], isLoading: dietaryLoading } = useQuery({
    queryKey: ["dietaryInfo"],
    queryFn: mockDietaryService.getDietaryInformation,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...profile, ...data, updated_at: new Date().toISOString() };
    },
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
    setIsEditDialogOpen(false);
  };

  const getDietaryPreferenceNames = () => {
    return dietaryInfo
      .filter(diet => profile.dietary_preferences.includes(diet.id))
      .map(diet => diet.name);
  };

  const getCookingExperienceLabel = (level: string) => {
    return COOKING_EXPERIENCE_LEVELS.find(l => l.value === level)?.label || level;
  };

  const getHouseholdSizeLabel = (size: number) => {
    return HOUSEHOLD_SIZES.find(h => h.value === size)?.label || `${size} people`;
  };

  if (dietaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        <Button onClick={() => setIsEditDialogOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt={profile.name} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <ChefHat className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Cooking Level:</span>
                <Badge variant="secondary">
                  {getCookingExperienceLabel(profile.cooking_experience)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Household:</span>
                <span>{getHouseholdSizeLabel(profile.household_size)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Member since:</span>
                <span>{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">{profile.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground mt-1">{profile.phone || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm text-muted-foreground mt-1">{profile.location || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cooking Experience</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getCookingExperienceLabel(profile.cooking_experience)}
                  </p>
                </div>
              </div>
              {profile.bio && (
                <div>
                  <Label className="text-sm font-medium">Bio</Label>
                  <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dietary Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Dietary Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getDietaryPreferenceNames().length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {getDietaryPreferenceNames().map((preference, index) => (
                    <Badge key={index} variant="secondary">
                      {preference}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No dietary preferences set</p>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch checked={profile.notification_preferences.email_notifications} disabled />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch checked={profile.notification_preferences.push_notifications} disabled />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Meal Reminders</Label>
                    <p className="text-xs text-muted-foreground">Get reminded about planned meals</p>
                  </div>
                  <Switch checked={profile.notification_preferences.meal_reminders} disabled />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Expiry Alerts</Label>
                    <p className="text-xs text-muted-foreground">Get notified about expiring items</p>
                  </div>
                  <Switch checked={profile.notification_preferences.expiry_alerts} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone || ""}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={editForm.date_of_birth || ""}
                    onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editForm.location || ""}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="City, State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cooking_experience">Cooking Experience</Label>
                  <Select
                    value={editForm.cooking_experience}
                    onValueChange={(value) => setEditForm({ ...editForm, cooking_experience: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COOKING_EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="household_size">Household Size</Label>
                  <Select
                    value={editForm.household_size.toString()}
                    onValueChange={(value) => setEditForm({ ...editForm, household_size: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOUSEHOLD_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value.toString()}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editForm.bio || ""}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Dietary Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dietary Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dietaryInfo.map((diet) => (
                  <div key={diet.id} className="flex items-center space-x-2">
                    <Switch
                      id={`diet-${diet.id}`}
                      checked={editForm.dietary_preferences.includes(diet.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setEditForm({
                            ...editForm,
                            dietary_preferences: [...editForm.dietary_preferences, diet.id]
                          });
                        } else {
                          setEditForm({
                            ...editForm,
                            dietary_preferences: editForm.dietary_preferences.filter(id => id !== diet.id)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`diet-${diet.id}`} className="text-sm">
                      {diet.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={editForm.notification_preferences.email_notifications}
                    onCheckedChange={(checked) => setEditForm({
                      ...editForm,
                      notification_preferences: {
                        ...editForm.notification_preferences,
                        email_notifications: checked
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={editForm.notification_preferences.push_notifications}
                    onCheckedChange={(checked) => setEditForm({
                      ...editForm,
                      notification_preferences: {
                        ...editForm.notification_preferences,
                        push_notifications: checked
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Meal Reminders</Label>
                    <p className="text-xs text-muted-foreground">Get reminded about planned meals</p>
                  </div>
                  <Switch
                    checked={editForm.notification_preferences.meal_reminders}
                    onCheckedChange={(checked) => setEditForm({
                      ...editForm,
                      notification_preferences: {
                        ...editForm.notification_preferences,
                        meal_reminders: checked
                      }
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Expiry Alerts</Label>
                    <p className="text-xs text-muted-foreground">Get notified about expiring items</p>
                  </div>
                  <Switch
                    checked={editForm.notification_preferences.expiry_alerts}
                    onCheckedChange={(checked) => setEditForm({
                      ...editForm,
                      notification_preferences: {
                        ...editForm.notification_preferences,
                        expiry_alerts: checked
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 