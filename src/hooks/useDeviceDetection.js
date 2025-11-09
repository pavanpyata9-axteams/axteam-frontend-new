import { useState, useEffect } from 'react';

const useDeviceDetection = () => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    isInitialized: false
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      try {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 768;
        const isTablet = screenWidth >= 768 && screenWidth < 1024;
        const isDesktop = screenWidth >= 1024;

        setDevice({
          isMobile,
          isTablet,
          isDesktop,
          screenWidth,
          isInitialized: true
        });
      } catch (error) {
        console.error('Device detection error:', error);
        // Fallback to desktop if error occurs
        setDevice({
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          screenWidth: 1024,
          isInitialized: true
        });
      }
    };

    // Add small delay to ensure proper initialization
    const timeoutId = setTimeout(() => {
      updateDeviceInfo();
    }, 50);

    // Add event listener for resize with debouncing
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDeviceInfo, 100);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return device;
};

export default useDeviceDetection;