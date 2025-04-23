
export interface ImageAdjustmentProps {
  imageUrl: string;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  onSizeChange: (size: number) => void;
  onLayoutChange: (layout: string) => void;
  size?: number;
  layout?: string;
}

export type ImageLayout = "standard" | "side-by-side" | "image-top" | "image-left" | "full-width";
