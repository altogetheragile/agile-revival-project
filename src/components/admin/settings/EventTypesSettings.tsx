
import { useState } from "react";
import { useEventTypesAdmin } from "@/hooks/useEventTypesAdmin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";

export const EventTypesSettings: React.FC = () => {
  const {
    eventTypes,
    isLoading,
    isSubmitting,
    loadEventTypes,
    addEventType,
    editEventType,
    removeEventType,
    getUsageCount
  } = useEventTypesAdmin();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [currentEventType, setCurrentEventType] = useState<{id: string, value: string, label: string} | null>(null);

  const openAddDialog = () => {
    setCurrentEventType(null);
    setNewValue("");
    setNewLabel("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (eventType: {id: string, value: string, label: string}) => {
    setCurrentEventType(eventType);
    setNewValue(eventType.value);
    setNewLabel(eventType.label);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (eventType: {id: string, value: string, label: string}) => {
    setCurrentEventType(eventType);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!newValue || !newLabel) {
      return;
    }

    let success = false;
    
    if (currentEventType) {
      success = await editEventType(currentEventType.id, newValue, newLabel);
    } else {
      success = await addEventType(newValue, newLabel);
    }

    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!currentEventType) {
      return;
    }

    const success = await removeEventType(currentEventType.id, currentEventType.label);
    
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Event Types</CardTitle>
          <CardDescription>
            Manage event types used in courses and events
          </CardDescription>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event Type
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading event types...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypes.length > 0 ? (
                eventTypes.map((eventType) => (
                  <TableRow key={eventType.id}>
                    <TableCell>{eventType.label}</TableCell>
                    <TableCell>
                      <code className="bg-muted px-1 py-0.5 rounded text-sm">
                        {eventType.value}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getUsageCount(eventType.id)} {getUsageCount(eventType.id) === 1 ? 'use' : 'uses'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(eventType)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(eventType)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No event types found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentEventType ? "Edit Event Type" : "Add Event Type"}
              </DialogTitle>
              <DialogDescription>
                {currentEventType
                  ? "Edit the details of this event type"
                  : "Add a new event type for courses and events"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="Workshop, Webinar, etc."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This is what users will see in the UI
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  placeholder="workshop"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                />
                <p className="text-sm text-muted-foreground">
                  This is used internally and in URLs (lowercase, no spaces)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !newValue || !newLabel}>
                {isSubmitting ? "Saving..." : currentEventType ? "Save Changes" : "Add Event Type"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event Type</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the "{currentEventType?.label}" event type? 
                {getUsageCount(currentEventType?.id || "") > 0 && (
                  <span className="font-semibold block mt-2 text-destructive">
                    This event type is used by {getUsageCount(currentEventType?.id || "")} course(s).
                    They will need to be reassigned before deletion.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isSubmitting || getUsageCount(currentEventType?.id || "") > 0}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
