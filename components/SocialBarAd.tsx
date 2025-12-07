import React, { useEffect, useRef } from 'react';

const SocialBarAd: React.FC = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Prevent duplicate injection
    if (document.querySelector('script[src*="5d40d079592c70d06c3d2b00c058421b.js"]')) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl28205809.effectivegatecpm.com/5d/40/d0/5d40d079592c70d06c3d2b00c058421b.js';
    script.async = true;
    
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      // Cleanup the script tag on unmount (e.g. logout)
      // Note: This removes the script tag, but some ads may leave residual DOM elements 
      // which is standard behavior for these networks.
      try {
        if (scriptRef.current && document.body.contains(scriptRef.current)) {
          document.body.removeChild(scriptRef.current);
        }
      } catch (e) {
        console.warn("Failed to remove Social Bar script", e);
      }
    };
  }, []);

  // Social Bars are overlays/toasts, so they don't need a visible placeholder in the DOM flow.
  return null;
};

export default SocialBarAd;