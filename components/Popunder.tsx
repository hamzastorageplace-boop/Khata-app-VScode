import React, { useEffect } from 'react';
import { getCurrentUser } from '../services/storage';

const Popunder: React.FC = () => {
  useEffect(() => {
    let scriptTimeout: NodeJS.Timeout | null = null;
    let script: HTMLScriptElement | null = null;

    const initPopunder = async () => {
      try {
        // STRICT CHECK: Ensure user is authenticated before doing anything
        const user = await getCurrentUser();
        if (!user) {
          console.log("Popunder: User not authenticated, skipping ad load");
          return;
        }

        // Check for cooldown to avoid excessive popunders
        const KEY = 'easy_khata_popunder_last_loaded';
        const COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown

        const lastLoadedStr = localStorage.getItem(KEY);
        const now = Date.now();

        if (lastLoadedStr) {
          const lastLoaded = parseInt(lastLoadedStr, 10);
          if (now - lastLoaded < COOLDOWN_MS) {
            console.log("Popunder: Skipped due to cooldown");
            return;
          }
        }

        // Remove any existing popunder scripts
        const existingScripts = document.querySelectorAll('script[src="//pl28202503.effectivegatecpm.com/d4/25/74/d4257492450b96c2394fa4924c11863a.js"]');
        existingScripts.forEach(s => {
          try {
            s.remove();
          } catch (e) {
            console.warn("Failed to remove existing popunder script", e);
          }
        });

        // Create and inject popunder script
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//pl28202503.effectivegatecpm.com/d4/25/74/d4257492450b96c2394fa4924c11863a.js';
        script.async = true;

        script.onload = () => {
          console.log("Popunder script loaded successfully");
          localStorage.setItem(KEY, now.toString());
        };

        script.onerror = () => {
          console.error("Popunder script failed to load");
          if (script && script.parentNode) {
            try {
              script.parentNode.removeChild(script);
            } catch (e) {
              console.warn("Failed to remove failed popunder script", e);
            }
          }
        };

        // Add timeout to prevent hanging
        scriptTimeout = setTimeout(() => {
          if (script && script.parentNode) {
            try {
              script.parentNode.removeChild(script);
              console.warn("Popunder script removed due to timeout");
            } catch (e) {
              console.warn("Failed to remove timed-out popunder script", e);
            }
          }
        }, 20000); // 20 second timeout

        // Inject into head for better compatibility
        const head = document.head || document.documentElement;
        if (head) {
          head.appendChild(script);
          console.log("Popunder script injected into head");
        }
      } catch (e) {
        console.error("Popunder initialization failed", e);
      }
    };

    // Delay popunder loading to avoid interference with initial page load
    const delayTimeout = setTimeout(() => {
      initPopunder();
    }, 3000); // Load after 3 seconds

    return () => {
      // Cleanup
      if (scriptTimeout) clearTimeout(scriptTimeout);
      if (delayTimeout) clearTimeout(delayTimeout);

      if (script && script.parentNode) {
        try {
          script.parentNode.removeChild(script);
        } catch (e) {
          console.warn("Failed to remove popunder script during cleanup", e);
        }
      }
    };
  }, []);

  return null; // Component renders nothing visibly
};

export default Popunder;