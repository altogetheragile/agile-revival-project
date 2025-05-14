
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { useEventTypeManagement } from "@/hooks/useEventTypeManagement";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

export const CourseFilterSettings = () => {
  // Category management
  const {
    categories,
    addMode: categoryAddMode,
    setAddMode: setCategoryAddMode,
    newCategory,
    setNewCategory,
    handleAddCategory,
    handleDeleteCategory
  } = useCategoryManagement();

  // Event type management
  const {
    eventTypes,
    addMode: eventTypeAddMode,
    setAddMode: setEventTypeAddMode,
    newEventType,
    setNewEventType,
    handleAddEventType,
    handleDeleteEventType
  } = useEventTypeManagement();

  // Handle adding a new category
  const onAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    
    handleAddCategory(() => {
      setCategoryAddMode(false);
      setNewCategory("");
    });
  };

  // Handle adding a new event type
  const onAddEventType = () => {
    if (!newEventType.trim()) {
      toast.error("Event type name cannot be empty");
      return;
    }
    
    handleAddEventType(() => {
      setEventTypeAddMode(false);
      setNewEventType("");
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Categories</CardTitle>
          <CardDescription>
            Manage the categories that can be used to classify courses and filter the course catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.value}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <span className="font-medium">{category.label}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category.value, () => {})}
                    aria-label={`Delete ${category.label} category`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {categoryAddMode ? (
              <div className="flex gap-2 mt-4">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={onAddCategory} disabled={!newCategory.trim()}>
                  Add
                </Button>
                <Button variant="outline" onClick={() => setCategoryAddMode(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setCategoryAddMode(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Types</CardTitle>
          <CardDescription>
            Manage the event types that can be used to classify your courses and events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventTypes.map((type) => (
                <div 
                  key={type.value}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <span className="font-medium">{type.label}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEventType(type.value, () => {})}
                    aria-label={`Delete ${type.label} event type`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {eventTypeAddMode ? (
              <div className="flex gap-2 mt-4">
                <Input
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  placeholder="New event type name"
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={onAddEventType} disabled={!newEventType.trim()}>
                  Add
                </Button>
                <Button variant="outline" onClick={() => setEventTypeAddMode(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setEventTypeAddMode(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Event Type
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
