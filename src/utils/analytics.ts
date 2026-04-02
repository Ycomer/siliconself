// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 measurement ID
export const GA_MEASUREMENT_ID = 'G-8KNKVJJERS';

// Initialize GA - call once on app load
export function initGA() {
  if (typeof window === 'undefined') return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
  });
  window.gtag = gtag;
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
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
