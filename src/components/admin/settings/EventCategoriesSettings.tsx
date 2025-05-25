
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useEventCategoriesAdmin } from "@/hooks/useEventCategoriesAdmin";

export const EventCategoriesSettings = () => {
  const {
    categories,
    usageCounts,
    isLoading,
    isAddingNew,
    editingCategory,
    newCategory,
    setNewCategory,
    setIsAddingNew,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleUpdateCategory,
    handleAddCategory,
    handleDeleteCategory
  } = useEventCategoriesAdmin();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Categories</CardTitle>
          <CardDescription>Loading categories...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Categories</CardTitle>
        <CardDescription>
          Manage event categories used throughout the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new category form */}
        {isAddingNew && (
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-label">Display Label</Label>
                <Input
                  id="new-label"
                  placeholder="e.g., User Experience"
                  value={newCategory.label}
                  onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new-value">Value ID</Label>
                <Input
                  id="new-value"
                  placeholder="e.g., ux-design"
                  value={newCategory.value}
                  onChange={(e) => setNewCategory({ ...newCategory, value: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used internally and in URLs. Use lowercase with hyphens.
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCategory} disabled={!newCategory.label || !newCategory.value}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Category
                </Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add category button */}
        {!isAddingNew && (
          <Button onClick={() => setIsAddingNew(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Category
          </Button>
        )}

        {/* Categories list */}
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
              {editingCategory?.id === category.id ? (
                // Edit mode
                <div className="flex-1 space-y-2">
                  <Input
                    value={editingCategory.label}
                    onChange={(e) => handleUpdateCategory({ ...editingCategory, label: e.target.value })}
                    placeholder="Display label"
                  />
                  <Input
                    value={editingCategory.value}
                    onChange={(e) => handleUpdateCategory({ ...editingCategory, value: e.target.value })}
                    placeholder="Value ID"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div className="flex-1">
                    <div className="font-medium">{category.label}</div>
                    <div className="text-sm text-muted-foreground">
                      Value: {category.value}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {usageCounts[category.id] || 0} uses
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartEdit(category)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={(usageCounts[category.id] || 0) > 0}
                      title={
                        (usageCounts[category.id] || 0) > 0
                          ? "Cannot delete category that is in use"
                          : "Delete category"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && !isAddingNew && (
          <div className="text-center py-8 text-muted-foreground">
            No categories found. Add your first category to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
