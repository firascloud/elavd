"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(() => import("./GoogleAnalytics"), {
  ssr: false,
});

export default function DeferredAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const enable = () => setEnabled(true);
    const passiveOnce: AddEventListenerOptions = { once: true, passive: true };

    window.addEventListener("pointerdown", enable, passiveOnce);
    window.addEventListener("keydown", enable, { once: true });
    window.addEventListener("scroll", enable, passiveOnce);

    return () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("scroll", enable);
    };
  }, []);

  return enabled ? <GoogleAnalytics /> : null;
}
