import React, { useEffect, useRef } from 'react';

const NativeBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Remove any previous scripts
      const existingScripts = containerRef.current.querySelectorAll('script');
      existingScripts.forEach(script => {
        try {
          script.remove();
        } catch (e) {
          console.warn("Failed to remove existing native banner script", e);
        }
      });

      // Create and inject the native banner script into document head
      // This is important for the ad network to properly initialize
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = '//pl28202452.effectivegatecpm.com/dcb0607e2053a1ece03fdc216bd5e470/invoke.js';
      script.charset = 'utf-8';

      script.onerror = () => {
        console.warn("Failed to load native banner ad");
      };

      script.onload = () => {
        console.log("Native banner ad loaded successfully");
      };

      // Try to load the script from both the container and the head for better compatibility
      containerRef.current.appendChild(script);
      
      // Also add a copy to the head for better ad network compatibility
      const headScript = document.createElement('script');
      headScript.async = true;
      headScript.setAttribute('data-cfasync', 'false');
      headScript.src = '//pl28202452.effectivegatecpm.com/dcb0607e2053a1ece03fdc216bd5e470/invoke.js';
      headScript.charset = 'utf-8';
      
      const head = document.head || document.documentElement;
      if (head) {
        head.appendChild(headScript);
        console.log("Native banner script also injected into head");
      }
    } catch (e) {
      console.error("Error initializing native banner", e);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id="container-dcb0607e2053a1ece03fdc216bd5e470"
      className="w-full flex justify-center py-2 md:py-4 my-2 md:my-4 min-h-[100px]"
    >
      {/* Native ad will be injected here */}
    </div>
  );
};

export default NativeBanner;
