"use client";

import { useCallback } from "react";
import { trackPageView, trackEvent, trackConversion } from "@/lib/analytics";

/**
 * A highly reusable hook for triggering client-side analytics events.
 * This encapsulates the logic, allowing easy updates if you switch tracking providers.
 */
export function useAnalytics() {
  const pageView = useCallback((url: string) => {
    trackPageView(url);
  }, []);

  const event = useCallback((params: { action: string; category: string; label?: string; value?: number }) => {
    trackEvent(params);
  }, []);

  const conversion = useCallback((send_to: string, value?: number, currency?: string) => {
    trackConversion(send_to, value, currency);
  }, []);

  return { pageView, event, conversion };
}
