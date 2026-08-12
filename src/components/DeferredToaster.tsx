"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("sonner").then((module) => module.Toaster), {
  ssr: false,
});

export default function DeferredToaster() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const enable = () => setEnabled(true);
    const options: AddEventListenerOptions = { once: true, passive: true };

    window.addEventListener("pointerdown", enable, options);
    window.addEventListener("keydown", enable, { once: true });

    return () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
    };
  }, []);

  return enabled ? <Toaster richColors position="top-right" /> : null;
}
