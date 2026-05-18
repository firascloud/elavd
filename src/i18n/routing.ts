import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

const locales = ['ar', 'en'];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ar',
  localePrefix: 'always',
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
