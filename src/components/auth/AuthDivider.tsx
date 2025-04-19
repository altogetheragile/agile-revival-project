
import { Separator } from '@/components/ui/separator';

export default function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-500">Or continue with</span>
      </div>
    </div>
  );
}
