// Performance optimization utilities for mobile

// Lazy load images with intersection observer
export const lazyLoadImage = (imageElement) => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  imageObserver.observe(imageElement);
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload logo
  const logoLink = document.createElement('link');
  logoLink.rel = 'preload';
  logoLink.href = '/axteam-logo.jpg';
  logoLink.as = 'image';
  document.head.appendChild(logoLink);

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
  fontLink.as = 'style';
  document.head.appendChild(fontLink);
};

// Debounce function for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if device is mobile
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Get network connection info
export const getConnectionInfo = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      saveData: connection.saveData
    };
  }
  return null;
};

// Optimize images based on device
export const getOptimizedImageSrc = (originalSrc, isMobile = false) => {
  if (!originalSrc) return originalSrc;
  
  // For mobile, we can return smaller versions or WebP format if supported
  if (isMobile) {
    // Add mobile optimization logic here
    // For now, return original
    return originalSrc;
  }
  
  return originalSrc;
};