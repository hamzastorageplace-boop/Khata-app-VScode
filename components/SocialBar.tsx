import React, { useEffect } from 'react';

const SocialBar: React.FC = () => {
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    try {
      // Avoid duplicate injection
      const existing = document.querySelectorAll('script[src*="pl28205809.effectivegatecpm.com"]');
      if (existing && existing.length > 0) {
        console.log('SocialBar: script already present, skipping injection');
        return;
      }

      // Insert script at end of body (closest equivalent to just before </body>)
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//pl28205809.effectivegatecpm.com/5d/40/d0/5d40d079592c70d06c3d2b00c058421b.js';
      script.async = true;
      script.defer = false;
      script.charset = 'utf-8';

      script.onload = () => {
        console.log('SocialBar: script loaded successfully');
      };

      script.onerror = () => {
        console.warn('SocialBar: failed to load script');
        if (script && script.parentNode) {
          try { script.parentNode.removeChild(script); } catch (e) { /* ignore */ }
        }
      };

      // Append to body so it appears right before </body>
      if (document.body) {
        document.body.appendChild(script);
      } else {
        // Fallback to head if body not yet available
        (document.head || document.documentElement).appendChild(script);
      }
    } catch (e) {
      console.error('SocialBar initialization failed', e);
    }

    return () => {
      if (script && script.parentNode) {
        try { script.parentNode.removeChild(script); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  // This component renders nothing visible; it just injects the script into the page body
  return null;
};

export default SocialBar;
