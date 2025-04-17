
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusHistoryEntry {
  status: string;
  changed_at: string;
  changed_to: string;
}

interface RegistrationStatusHistoryProps {
  history: StatusHistoryEntry[];
}

export const RegistrationStatusHistory = ({ history }: RegistrationStatusHistoryProps) => {
  if (!history?.length) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Clock className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Status History</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm text-gray-500">
                  Changed from <Badge variant="outline">{entry.status}</Badge> to{" "}
                  <Badge variant="outline">{entry.changed_to}</Badge>
                </p>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(entry.changed_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
