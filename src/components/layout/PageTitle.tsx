import { useEffect } from 'react';
import { useSiteSettings } from '@/contexts/site-settings';

const PageTitle = ({ pageTitle }: { pageTitle?: string }) => {
  const { settings } = useSiteSettings();
  
  useEffect(() => {
    const siteName = settings.general?.siteName || 'AltogetherAgile';
    
    // If a page-specific title is provided, use "PageTitle | SiteName" format
    // Otherwise just use the site name
    document.title = pageTitle ? `${pageTitle} | ${siteName}` : siteName;
  }, [settings.general?.siteName, pageTitle]);
  
  return null; // This is a utility component with no UI
};

export default PageTitle;
