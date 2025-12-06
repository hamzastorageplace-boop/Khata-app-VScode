import React, { useEffect } from 'react';
import { getCurrentUser } from '../services/storage';

const Popunder: React.FC = () => {
  useEffect(() => {
    let scriptTimeout: NodeJS.Timeout | null = null;
    let scripts: HTMLScriptElement[] = [];

    const initAd = async () => {
      try {
        // STRICT CHECK: Ensure user is authenticated before doing anything
        const user = await getCurrentUser();
        if (!user) {
          // User is not logged in, do not load the ad
          console.log("Popunder: User not authenticated, skipping ad load");
          return;
        }

        // Check if we're on a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Detect screen size
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isSmallScreen = screenWidth < 768;

        // Log for debugging
        console.log(`Popunder: Mobile=${isMobile}, ScreenSize=${screenWidth}x${screenHeight}`);

        // Logic to limit annoyance: Check if we loaded this recently
        const KEY = 'easy_khata_popunder_last_loaded';
        const COOLDOWN_MS = 10 * 1000; // 10 seconds cooldown

        const lastLoadedStr = localStorage.getItem(KEY);
        const now = Date.now();

        if (lastLoadedStr) {
          const lastLoaded = parseInt(lastLoadedStr, 10);
          if (now - lastLoaded < COOLDOWN_MS) {
            // Too soon! Skip loading the ad to respect user experience
            console.log("Popunder: Skipped due to cooldown");
            return;
          }
        }

        // Clear any previously failed scripts
        scripts.forEach(script => {
          if (document.body.contains(script)) {
            try {
              document.body.removeChild(script);
            } catch (e) {
              console.warn("Failed to remove old popunder script", e);
            }
          }
        });
        scripts = [];

        // Load the script with better error handling
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//pl28202503.effectivegatecpm.com/d4/25/74/d4257492450b96c2394fa4924c11863a.js';
        script.async = true;

        // Add success and error handlers
        script.onload = () => {
          console.log("Popunder script loaded successfully");
          localStorage.setItem(KEY, now.toString());
        };

        script.onerror = () => {
          console.error("Popunder script failed to load");
          // Remove failed script
          if (document.body.contains(script)) {
            try {
              document.body.removeChild(script);
            } catch (e) {
              console.warn("Failed to remove failed popunder script", e);
            }
          }
        };

        // Add timeout to prevent hanging
        scriptTimeout = setTimeout(() => {
          if (document.body.contains(script)) {
            try {
              document.body.removeChild(script);
              console.warn("Popunder script removed due to timeout");
            } catch (e) {
              console.warn("Failed to remove timed-out popunder script", e);
            }
          }
        }, 15000); // 15 second timeout

        document.body.appendChild(script);
        scripts.push(script);

      } catch (e) {
        console.error("Popunder initialization failed", e);
      }
    };

    // Delay popunder loading to avoid interference with initial page load
    const delayTimeout = setTimeout(() => {
      initAd();
    }, 3000); // Load after 3 seconds

    return () => {
      // Cleanup
      if (scriptTimeout) clearTimeout(scriptTimeout);
      if (delayTimeout) clearTimeout(delayTimeout);
      
      scripts.forEach(script => {
        if (script && document.body.contains(script)) {
          try {
            document.body.removeChild(script);
          } catch (e) {
            console.warn("Failed to remove popunder script", e);
          }
        }
      });
    };
  }, []);

  return null; // Component renders nothing visibly
};

export default Popunder;