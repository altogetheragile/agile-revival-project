
interface Window {
  WorkshopButlerWidget?: {
    init: () => void;
    configure?: (options: any) => void;
  };
}

// Add this for our service section
interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  url: string;
}
