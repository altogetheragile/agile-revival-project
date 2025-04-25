import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { EmailTester } from "./EmailTester";

export function ServicesSettings() {
  return (
    <div className="space-y-6">
      <EmailTester />
    </div>
  );
}
