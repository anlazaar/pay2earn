import { setRequestLocale } from "next-intl/server";
import RegisterPageClient from "./RegisterPageClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterPageClient />;
}
