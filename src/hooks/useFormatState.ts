
import { useState } from "react";
import { CourseFormat, defaultFormats } from "@/types/courseFormat";

export const useFormatState = () => {
  const [formats, setFormats] = useState<CourseFormat[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newFormat, setNewFormat] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  return {
    formats,
    setFormats,
    addMode,
    setAddMode,
    newFormat,
    setNewFormat,
    isProcessing,
    setIsProcessing
  };
};
