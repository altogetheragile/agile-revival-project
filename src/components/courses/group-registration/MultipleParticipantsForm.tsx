
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { GroupRegistrationFormValues } from "./types";
import CSVUploadSection from "./CSVUploadSection";
import ParticipantFields from "./ParticipantFields";

interface MultipleParticipantsFormProps {
  form: UseFormReturn<GroupRegistrationFormValues>;
}

const MultipleParticipantsForm: React.FC<MultipleParticipantsFormProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const handleAddParticipant = () => {
    append({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-medium">Participants</h3>
        <div className="flex gap-2">
          <CSVUploadSection form={form} />
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
            <ParticipantFields
              key={field.id}
              index={index}
              form={form}
              onRemove={() => remove(index)}
            />
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
