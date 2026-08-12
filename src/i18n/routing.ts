import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

const locales = ['ar', 'en'];

export const routing = defineRouting({
  locales,
  defaultLocale: 'ar',
  localePrefix: 'never',
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
