
import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RegistrationStatusManager } from "./RegistrationStatusManager";
import { RegistrationStatusHistory } from "./RegistrationStatusHistory";

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string | null;
  additional_notes: string | null;
  created_at: string;
  status: string;
  status_history?: any[];
}

interface CourseRegistrationsTableProps {
  registrations: Registration[];
  onRegistrationUpdated?: () => void;
}

export const CourseRegistrationsTable = ({ 
  registrations,
  onRegistrationUpdated 
}: CourseRegistrationsTableProps) => {
  if (registrations.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No registrations found for this course.
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-amber-500">Pending</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>History</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">
                  {registration.first_name} {registration.last_name}
                </TableCell>
                <TableCell>{registration.email}</TableCell>
                <TableCell>{registration.phone}</TableCell>
                <TableCell>{registration.company || "-"}</TableCell>
                <TableCell>
                  {new Date(registration.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{getStatusBadge(registration.status)}</TableCell>
                <TableCell>
                  <RegistrationStatusHistory history={registration.status_history || []} />
                </TableCell>
                <TableCell>
                  <RegistrationStatusManager
                    registrationId={registration.id}
                    currentStatus={registration.status}
                    onStatusChange={onRegistrationUpdated || (() => {})}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
