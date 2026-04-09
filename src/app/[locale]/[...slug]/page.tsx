/**
 * Catch-all route — any URL that doesn't match a known route lands here.
 * We call notFound() which returns HTTP 404 (not 200 soft-404).
 * The locale-aware 404 UI is rendered by the [locale]/not-found.tsx file,
 * but as a fallback we also render NotFoundPage here for good UX.
 */
import { notFound } from 'next/navigation';

export default function CatchAllPage() {
  // This triggers the nearest not-found boundary, returning a true HTTP 404.
  notFound();
}

