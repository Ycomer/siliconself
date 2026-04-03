// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 measurement ID
export const GA_MEASUREMENT_ID = 'G-3VW90EVJKK';

// Initialize GA - call once on app load
export function initGA() {
  if (typeof window === 'undefined') return;

  // Set up dataLayer and gtag function first
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
  });

  // Then load the script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
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
