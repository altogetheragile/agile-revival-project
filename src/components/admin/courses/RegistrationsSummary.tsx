
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRegistrationsSummary } from "@/utils/courseUtils";
import { Building, CheckCircle, Clock, Users, XCircle } from "lucide-react";

interface Registration {
  id: string;
  status: string;
  company?: string;
}

interface RegistrationsSummaryProps {
  registrations: Registration[];
  spotsAvailable: number;
}

export const RegistrationsSummary = ({ registrations, spotsAvailable }: RegistrationsSummaryProps) => {
  const summary = getRegistrationsSummary(registrations);
  const spotsRemaining = spotsAvailable - (summary.confirmed + summary.pending);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-400" />
              <p className="text-3xl font-bold">{summary.total}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <p className="text-3xl font-bold text-green-600">{summary.confirmed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-amber-500" />
              <p className="text-3xl font-bold text-amber-600">{summary.pending}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-500" />
              <p className="text-3xl font-bold text-blue-600">{summary.organizations}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              <p className="text-3xl font-bold text-blue-600">{spotsRemaining}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {summary.organizations > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Group Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(summary.groupedByCompany)
                .filter(([company]) => company !== 'Individual')
                .map(([company, registrations]) => (
                  <div key={company} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                    <div>
                      <span className="font-medium">{company}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({registrations.length} {registrations.length === 1 ? 'participant' : 'participants'})
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                        {registrations.filter(r => r.status === 'confirmed').length} confirmed
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">
                        {registrations.filter(r => r.status === 'pending').length} pending
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
