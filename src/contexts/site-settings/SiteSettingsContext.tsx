
import { createContext } from 'react';
import { AllSettings } from './types';

// Rename the interface to avoid naming conflict with the one in types.ts
export interface SiteSettingsContextValue {
  settings: AllSettings;
  isLoading: boolean;
  updateSettings: (key: string, values: any, silentMode?: boolean) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

// Create context with default values
export const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: {} as AllSettings,
  isLoading: true,
  updateSettings: async () => {},
  refreshSettings: async () => {},
});
