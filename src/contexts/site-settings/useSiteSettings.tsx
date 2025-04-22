
import { useContext } from 'react';
import { SiteSettingsContext, SiteSettingsContextValue } from './SiteSettingsContext';

export const useSiteSettings = (): SiteSettingsContextValue => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
