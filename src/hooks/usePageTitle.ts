import { useEffect } from 'react';

/**
 * Sets document.title for the current page.
 * Format: "<pageTitle> | MindEase"
 * Pass an empty string to get the default brand-only title.
 */
const usePageTitle = (pageTitle: string) => {
  useEffect(() => {
    const brand = 'MindEase';
    document.title = pageTitle ? `${pageTitle} | ${brand}` : brand;

    // Restore default on unmount
    return () => {
      document.title = brand;
    };
  }, [pageTitle]);
};

export default usePageTitle;
