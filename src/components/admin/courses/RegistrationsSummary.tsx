
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Registration {
  id: string;
  status: string;
}

interface RegistrationsSummaryProps {
  registrations: Registration[];
  spotsAvailable: number;
}

export const RegistrationsSummary = ({ registrations, spotsAvailable }: RegistrationsSummaryProps) => {
  const totalRegistrations = registrations.length;
  const confirmedRegistrations = registrations.filter(r => r.status === "confirmed").length;
  const pendingRegistrations = registrations.filter(r => r.status === "pending").length;
  const cancelledRegistrations = registrations.filter(r => r.status === "cancelled").length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalRegistrations}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{confirmedRegistrations}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-amber-600">{pendingRegistrations}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Available Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{spotsAvailable}</p>
        </CardContent>
      </Card>
    </div>
  );
};
