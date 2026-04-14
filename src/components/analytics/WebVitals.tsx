"use client";

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Only send the metric to GA4 if the global gtag function exists
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      // Use the 'event' command to send the Web Vitals metric
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true, 
      });
    } else if (process.env.NODE_ENV === "development") {
      // In development, log it nicely to the console for debugging
      console.log(`[Web Vitals] ${metric.name}:`, { value: metric.value, id: metric.id });
    }
  });

  return null;
}
