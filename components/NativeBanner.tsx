import React, { useEffect, useRef } from 'react';

const NativeBanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Clear any previous scripts
      const existingScripts = containerRef.current.querySelectorAll('script');
      existingScripts.forEach(script => script.remove());

      // Create and inject the native banner script
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = '//pl28202452.effectivegatecpm.com/dcb0607e2053a1ece03fdc216bd5e470/invoke.js';
      script.onerror = () => {
        console.warn("Failed to load native banner ad");
      };
      script.onload = () => {
        console.log("Native banner ad loaded successfully");
      };

      containerRef.current.appendChild(script);
    } catch (e) {
      console.error("Error initializing native banner", e);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id="container-dcb0607e2053a1ece03fdc216bd5e470"
      className="w-full flex justify-center py-4 my-4"
    >
      {/* Native ad will be injected here */}
    </div>
  );
};

export default NativeBanner;
