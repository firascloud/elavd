// Next.js uses URL.canParse internally, but it is newer than the rest of the
// framework's supported browser baseline. Keep only this small compatibility
// fallback instead of shipping the legacy language-feature polyfill bundle.
const browserURL = URL as unknown as {
  canParse?: (url: string | URL, base?: string | URL) => boolean;
};

if (typeof browserURL.canParse !== "function") {
  browserURL.canParse = (url: string | URL, base?: string | URL): boolean => {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}

export {};
