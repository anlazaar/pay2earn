import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Define your languages
export const locales = ["en", "fr", "ar"];

// FIX: Use 'requestLocale' (Promise) instead of 'locale'
export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Await the locale promise
  let locale = await requestLocale;

  // 2. Validate it. If undefined or invalid, fallback to 'en'
  if (!locale || !locales.includes(locale as any)) {
    locale = "en";
  }

  return {
    // 3. You MUST return the locale now
    locale,
    messages: (await import(`./src/messages/${locale}.json`)).default,
  };
});
