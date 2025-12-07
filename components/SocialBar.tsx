import React, { useEffect } from 'react';

const SocialBar: React.FC = () => {
  useEffect(() => {
    let scripts: HTMLScriptElement[] = [];
    let retryCount = 0;
    const maxRetries = 5;

    const injectScript = () => {
      try {
        console.log(`SocialBar: injection attempt ${retryCount + 1} of ${maxRetries}`);

        // Create script element
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//pl28205809.effectivegatecpm.com/5d/40/d0/5d40d079592c70d06c3d2b00c058421b.js';
        script.async = true;
        script.defer = false;
        script.charset = 'utf-8';

        script.onload = () => {
          console.log('SocialBar: script loaded successfully from source');
          retryCount = maxRetries; // Stop retrying on success
        };

        script.onerror = () => {
          console.warn('SocialBar: script load attempt failed, will retry');
          if (script && script.parentNode) {
            try { 
              script.parentNode.removeChild(script); 
              const idx = scripts.indexOf(script);
              if (idx > -1) scripts.splice(idx, 1);
            } catch (e) { /* ignore */ }
          }
          // Retry if not at max attempts
          if (retryCount < maxRetries - 1) {
            retryCount++;
            setTimeout(() => injectScript(), 2000 + retryCount * 1000);
          }
        };

        // Aggressive: Try head first (usually better for ad scripts)
        if (document.head) {
          document.head.appendChild(script);
          scripts.push(script);
          console.log('SocialBar: script injected into head');
        } else if (document.body) {
          document.body.appendChild(script);
          scripts.push(script);
          console.log('SocialBar: script injected into body');
        } else {
          // Last resort: append to documentElement
          document.documentElement.appendChild(script);
          scripts.push(script);
          console.log('SocialBar: script injected into documentElement');
        }

        // Also inject a copy into body as backup (aggressive approach)
        if (document.body && scripts.length === 1) {
          const bodyScript = document.createElement('script');
          bodyScript.type = 'text/javascript';
          bodyScript.src = '//pl28205809.effectivegatecpm.com/5d/40/d0/5d40d079592c70d06c3d2b00c058421b.js';
          bodyScript.async = true;
          bodyScript.defer = false;
          bodyScript.charset = 'utf-8';

          bodyScript.onerror = () => {
            if (bodyScript && bodyScript.parentNode) {
              try { 
                bodyScript.parentNode.removeChild(bodyScript);
                const idx = scripts.indexOf(bodyScript);
                if (idx > -1) scripts.splice(idx, 1);
              } catch (e) { /* ignore */ }
            }
          };

          document.body.appendChild(bodyScript);
          scripts.push(bodyScript);
          console.log('SocialBar: backup script injected into body');
        }
      } catch (e) {
        console.error('SocialBar injection failed', e);
        if (retryCount < maxRetries - 1) {
          retryCount++;
          setTimeout(() => injectScript(), 2000 + retryCount * 1000);
        }
      }
    };

    // Initial injection immediately
    injectScript();

    // Retry after delay if DOM wasn't ready
    const initialRetryTimeout = setTimeout(() => {
      if (scripts.length === 0 && retryCount === 0) {
        console.log('SocialBar: retrying initial injection after DOM ready');
        injectScript();
      }
    }, 1000);

    return () => {
      clearTimeout(initialRetryTimeout);
      scripts.forEach(script => {
        if (script && script.parentNode) {
          try { 
            script.parentNode.removeChild(script); 
          } catch (e) { /* ignore */ }
        }
      });
    };
  }, []);

  // This component renders nothing visible; it just injects the script into the page
  return null;
};

export default SocialBar;
