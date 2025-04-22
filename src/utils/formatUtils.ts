
import { CourseFormat } from "@/types/courseFormat";

export const validateNewFormat = (formats: CourseFormat[], newFormat: string): boolean => {
  return !formats.some(opt => 
    opt.value.toLowerCase() === newFormat.trim().toLowerCase().replace(/\s+/g, '-') ||
    opt.label.toLowerCase() === newFormat.trim().toLowerCase()
  );
};

export const createFormatObject = (formatString: string): CourseFormat => {
  return {
    value: formatString.trim().toLowerCase().replace(/\s+/g, '-'),
    label: formatString.trim()
  };
};

export const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
