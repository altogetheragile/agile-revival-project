
import { useContext } from 'react';
import { SiteSettingsContext, SiteSettingsContextType } from './SiteSettingsContext';

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
