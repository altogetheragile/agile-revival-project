
export interface StorageEvents {
  coursesUpdated: CustomEvent<{ timestamp: number; cacheBust: string }>;
}

declare global {
  interface WindowEventMap {
    'courses-data-updated': StorageEvents['coursesUpdated'];
  }
}
