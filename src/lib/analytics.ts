export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const GADS_TRACKING_ID = process.env.NEXT_PUBLIC_GADS_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Tracks a page view using Google Analytics 4
 * @param url The current page path
 */
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined" && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[GA4] Pageview Tracked: ${url}`);
  }
};

/**
 * Tracks a custom event in Google Analytics 4
 * Suggestion: Use consistent naming conventions (e.g. lowercase with underscores like 'form_submit')
 */
export const trackEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[GA4] Event Tracked: ${action}`, { category, label, value });
  }
};

/**
 * Tracks a Google Ads Conversion
 * ONLY call this on successful events (e.g. successful form submission or finalized order, NOT on button click)
 * @param send_to The conversion tracking ID and label (e.g. AW-123456789/AbCdEfGhIj)
 * @param value The value of the conversion
 * @param currency Transaction currency
 */
export const trackConversion = (
  send_to: string,
  value: number = 1.0,
  currency: string = "SAR"
) => {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
    window.gtag("event", "conversion", {
      send_to: send_to,
      value: value,
      currency: currency,
    });
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[Google Ads] Conversion Tracked to: ${send_to}`, { value, currency });
  }
};
