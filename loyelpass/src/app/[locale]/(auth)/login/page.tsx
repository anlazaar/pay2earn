import { setRequestLocale } from "next-intl/server";
import LoginPageClient from "./LoginPageClient"; // We will rename your existing file to this

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  // 1. Await params to get the locale
  const { locale } = await params;

  // 2. This is the "Magic" line that enables translations for this page
  setRequestLocale(locale);

  return <LoginPageClient />;
}
