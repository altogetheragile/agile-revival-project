
import { createContext } from 'react';
import { AllSettings } from './types';

export interface SiteSettingsContextType {
  settings: AllSettings;
  isLoading: boolean;
  updateSettings: (key: string, values: any, silentMode?: boolean) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

// Create context with default values
export const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: {} as AllSettings,
  isLoading: true,
  updateSettings: async () => {},
  refreshSettings: async () => {},
});
