
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Schema for a single participant
export const participantSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  // Make phone a required field with a reasonable validation
  phone: z.string().min(1, "Phone number is required"),
});

// Schema for group registration form
export const groupRegistrationSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  contactPerson: participantSchema.omit({ phone: true }),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
  additionalNotes: z.string().optional(),
  participants: z.array(participantSchema).min(1, "At least one participant is required"),
});

export type GroupRegistrationFormValues = z.infer<typeof groupRegistrationSchema>;

interface MultipleParticipantsFormProps {
  form: UseFormReturn<GroupRegistrationFormValues>;
}

const MultipleParticipantsForm: React.FC<MultipleParticipantsFormProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleAddParticipant = () => {
    append({
      firstName: "",
      lastName: "",
      email: "",
      phone: "", // Empty string default ensures it's not null
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is CSV
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setUploadError("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n');
        
        // Skip header row if it exists
        const startRow = rows[0].toLowerCase().includes('first') ? 1 : 0;
        
        const parsedParticipants = [];
        
        for (let i = startRow; i < rows.length; i++) {
          if (!rows[i].trim()) continue; // Skip empty lines
          
          const columns = rows[i].split(',');
          if (columns.length < 3) continue; // Need at least firstName, lastName, email
          
          parsedParticipants.push({
            firstName: columns[0].trim(),
            lastName: columns[1].trim(),
            email: columns[2].trim(),
            // Ensure phone is always a string, even if empty
            phone: columns.length > 3 && columns[3].trim() ? columns[3].trim() : ""
          });
        }
        
        if (parsedParticipants.length === 0) {
          setUploadError("No valid participants found in the CSV file");
          return;
        }
        
        // Replace existing participants with the uploaded ones
        form.setValue("participants", parsedParticipants);
        setUploadError(null);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setUploadError("Error parsing the CSV file. Please check the format.");
      }
    };
    
    reader.readAsText(file);
    // Reset the input to allow uploading the same file again
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-medium">Participants</h3>
        <div className="flex gap-2">
          <div>
            <Input
              type="file"
              id="csv-upload"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="csv-upload">
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer flex items-center gap-2"
                asChild
              >
                <span>
                  <Upload size={16} />
                  Upload CSV
                </span>
              </Button>
            </label>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddParticipant}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Add Participant
          </Button>
        </div>
      </div>
      
      {uploadError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
          {uploadError}
        </div>
      )}
      
      <div className="p-3 bg-blue-50 text-blue-600 rounded-md border border-blue-200 text-sm">
        <p className="font-medium">CSV Format:</p>
        <p>First Name, Last Name, Email, Phone (required)</p>
        <p className="text-xs mt-1">Example: John, Doe, john.doe@example.com, +1234567890</p>
      </div>
      
      {fields.length === 0 ? (
        <div className="p-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No participants added yet.</p>
          <Button type="button" variant="ghost" onClick={handleAddParticipant} className="mt-2">
            Add your first participant
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => remove(index)}
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`participants.${index}.firstName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.lastName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone*</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Enter phone number" 
                          {...field} 
                          className="border-amber-300" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {fields.length > 0 && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddParticipant} 
          className="w-full border-dashed"
        >
          <Plus size={16} className="mr-2" /> Add Another Participant
        </Button>
      )}
    </div>
  );
};

export default MultipleParticipantsForm;
