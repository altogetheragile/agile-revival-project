
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  email: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function EmailInput({ email, onChange, disabled }: EmailInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full"
        disabled={disabled}
        autoComplete="email"
      />
    </div>
  );
}
