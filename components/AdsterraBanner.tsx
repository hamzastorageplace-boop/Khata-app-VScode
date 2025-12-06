import React, { useEffect, useRef, useState } from 'react';

interface AdsterraBannerProps {
  height?: number;
  width?: number;
}

const AdsterraBanner: React.FC<AdsterraBannerProps> = ({ height = 50, width = 320 }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    // Detect if mobile and adjust dimensions
    const handleResize = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
      setWindowWidth(width);
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Determine responsive dimensions
    let adWidth = width;
    let adHeight = height;

    if (isMobile) {
      // Mobile responsive sizes
      if (windowWidth < 360) {
        adWidth = 280;
        adHeight = 50;
      } else if (windowWidth < 480) {
        adWidth = 300;
        adHeight = 50;
      } else {
        adWidth = 320;
        adHeight = 50;
      }
    }

    try {
      // Clear any existing scripts to prevent duplicates
      bannerRef.current.innerHTML = '';

      const zoneId = '8bb77c4d84ed657dab7d370c26e05600'; 
      const scriptUrl = `//www.highperformanceformat.com/${zoneId}/invoke.js`; 

      // Create configuration script
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.async = true;
      confScript.innerHTML = `
        if (typeof atOptions === 'undefined') {
          var atOptions = {};
        }
        atOptions = {
          'key' : '${zoneId}',
          'format' : 'iframe',
          'height' : ${adHeight},
          'width' : ${adWidth},
          'params' : {}
        };
      `;

      // Create invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = scriptUrl;
      invokeScript.async = true;

      // Add error handling
      invokeScript.onerror = () => {
        console.warn("Failed to load Adsterra banner ad");
      };

      if (bannerRef.current) {
        bannerRef.current.appendChild(confScript);
        bannerRef.current.appendChild(invokeScript);
      }
    } catch (e) {
      console.error("Error initializing Adsterra banner", e);
    }
  }, [isMobile, windowWidth]);

  return (
    <div className="flex justify-center items-center my-4 overflow-hidden relative z-10 min-h-[50px] w-full">
      <div 
        ref={bannerRef} 
        style={{ 
          width: isMobile ? (windowWidth < 360 ? 280 : windowWidth < 480 ? 300 : 320) : width,
          height: height,
          minHeight: height
        }}
        className="bg-white/5 rounded-lg flex items-center justify-center border border-white/5 shadow-lg backdrop-blur-sm overflow-hidden"
      >
      </div>
    </div>
  );
};

export default AdsterraBanner;