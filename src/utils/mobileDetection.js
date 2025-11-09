// Enhanced mobile detection utilities

export const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile devices
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  // Check for tablets specifically
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  
  // Check for iPhone specifically
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  // Check for Android
  const isAndroid = /android/i.test(userAgent);
  
  // Check screen size
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  return {
    isMobile: isMobile || screenWidth < 768,
    isTablet: isTablet || (screenWidth >= 768 && screenWidth < 1024),
    isDesktop: !isMobile && screenWidth >= 1024,
    isIOS,
    isAndroid,
    screenWidth,
    screenHeight,
    orientation: screenWidth > screenHeight ? 'landscape' : 'portrait',
    pixelRatio: window.devicePixelRatio || 1,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
};

export const isSlowNetwork = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  }
  return false;
};

export const isSaveDataEnabled = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection.saveData;
  }
  return false;
};

export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
  }
  
  return { browserName, browserVersion };
};

export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export const getViewportSize = () => {
  return {
    width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  };
};