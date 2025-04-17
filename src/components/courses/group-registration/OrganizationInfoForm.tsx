
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GroupRegistrationFormValues } from "./types";

interface OrganizationInfoFormProps {
  form: UseFormReturn<GroupRegistrationFormValues>;
}

const OrganizationInfoForm: React.FC<OrganizationInfoFormProps> = ({ form }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Organization Information</h3>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPerson.firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person First Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Contact person's first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPerson.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person Last Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Contact person's last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactPerson.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person Email*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Contact email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone*</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Contact phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any specific requirements or questions?" 
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default OrganizationInfoForm;
