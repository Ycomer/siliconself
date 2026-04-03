// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 measurement ID
export const GA_MEASUREMENT_ID = 'G-3VW90EVJKK';

// Initialize GA - call once on app load
export function initGA() {
  // Add gtag.js script
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);

  // Add inline gtag initialization script
  const inlineScript = document.createElement('script');
  inlineScript.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
  `;
  document.head.appendChild(inlineScript);

  // Also set up window.gtag for tracking calls
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: unknown[]) { window.dataLayer.push(args); };
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}

// Track language switch
export function trackLangSwitch(lang: string) {
  trackEvent('switch_language', 'engagement', lang);
}

// Track CTA click
export function trackCTAClick() {
  trackEvent('cta_click', 'conversion', 'follow_journey');
}

// Track section view
export function trackSectionView(section: string) {
  trackEvent('section_view', 'engagement', section);
}

// Type augmentation
declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (command: string, ...args: unknown[]) => void;
  }
}
