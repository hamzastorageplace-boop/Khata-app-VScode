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
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      setWindowWidth(w);
      setIsMobile(w < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!bannerRef.current) return;

    try {
      // Clear any existing content
      bannerRef.current.innerHTML = '';

      // Determine responsive dimensions based on screen size
      let adWidth = 320;
      let adHeight = 50;

      if (isMobile) {
        if (windowWidth < 360) {
          adWidth = 280;
        } else if (windowWidth < 480) {
          adWidth = 300;
        } else {
          adWidth = 320;
        }
      } else {
        adWidth = width;
        adHeight = height;
      }

      // Set window global atOptions for the ad network
      (window as any).atOptions = {
        key: '8bb77c4d84ed657dab7d370c26e05600',
        format: 'iframe',
        height: adHeight,
        width: adWidth,
        params: {}
      };

      // Create and inject the invoke script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//www.highperformanceformat.com/8bb77c4d84ed657dab7d370c26e05600/invoke.js';

      script.onerror = () => {
        console.warn("Failed to load Adsterra banner ad");
      };

      script.onload = () => {
        console.log("Adsterra banner ad loaded successfully");
      };

      if (bannerRef.current) {
        bannerRef.current.appendChild(script);
      }
    } catch (e) {
      console.error("Error initializing Adsterra banner", e);
    }
  }, [isMobile, windowWidth, height, width]);

  return (
    <div className="flex justify-center items-center my-2 md:my-4 overflow-hidden relative z-10 w-full">
      <div 
        ref={bannerRef}
        style={{ 
          minHeight: height,
          width: isMobile ? (windowWidth < 360 ? 280 : windowWidth < 480 ? 300 : 320) : width,
          height: height
        }}
        className="bg-white/5 rounded-lg flex items-center justify-center border border-white/5 shadow-lg backdrop-blur-sm overflow-hidden"
      >
      </div>
    </div>
  );
};

export default AdsterraBanner;