// app/[locale]/dashboard-router/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function DashboardRouter() {
  const session = await auth();
  const locale = await getLocale(); // Get current locale (en, fr, or ar)

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const role = session.user.role;

  // Prefix every redirect with the locale
  switch (role) {
    case "ADMIN":
      redirect(`/${locale}/admin`);
    case "BUSINESS":
      redirect(`/${locale}/business`);
    case "WAITER":
      redirect(`/${locale}/waiter`);
    case "CLIENT":
      redirect(`/${locale}/client`);
    default:
      return <div>Error: Unknown Role</div>;
  }
}
