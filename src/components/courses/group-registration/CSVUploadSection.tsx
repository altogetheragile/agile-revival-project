
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { GroupRegistrationFormValues } from "./types";

interface CSVUploadSectionProps {
  form: UseFormReturn<GroupRegistrationFormValues>;
}

const CSVUploadSection: React.FC<CSVUploadSectionProps> = ({ form }) => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setUploadError("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n');
        const startRow = rows[0].toLowerCase().includes('first') ? 1 : 0;
        const parsedParticipants = [];
        
        for (let i = startRow; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const columns = rows[i].split(',');
          if (columns.length < 3) continue;
          
          parsedParticipants.push({
            firstName: columns[0].trim(),
            lastName: columns[1].trim(),
            email: columns[2].trim(),
            phone: columns.length > 3 && columns[3].trim() ? columns[3].trim() : ""
          });
        }
        
        if (parsedParticipants.length === 0) {
          setUploadError("No valid participants found in the CSV file");
          return;
        }
        
        form.setValue("participants", parsedParticipants);
        setUploadError(null);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setUploadError("Error parsing the CSV file. Please check the format.");
      }
    };
    
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CSVUploadSection;
