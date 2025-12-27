import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/navigation"; 
import { notFound } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "loylpass - Next Gen Loyalty",
  description: "Customer retention made simple.",
};

// 1. REQUIRED: This tells Next.js which locales to generate at build time
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;

  // 2. REQUIRED: Validate the locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 3. REQUIRED for Next.js 15 + next-intl static/server rendering
  setRequestLocale(locale);

  // 4. Fetch messages for the Client Provider
  const messages = await getMessages();

  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const fontVariables = isArabic
    ? cairo.variable
    : `${geistSans.variable} ${geistMono.variable}`;

  const fontClassName = isArabic ? "font-cairo" : "font-sans";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${fontVariables} ${fontClassName} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {props.children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
