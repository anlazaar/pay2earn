import { auth } from "@/auth";
import { DashboardShell, NavItem } from "@/components/DashboardShell";
import { getLocale, getTranslations } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("DashboardShell");
  const session = await auth();
  const role = session?.user?.role || "BUSINESS";

  const user = {
    name: session?.user?.name,
    role: t(`roles.${role}`),
    email: session?.user?.email,
  };

  const adminNavItems: NavItem[] = [
    { name: t("nav.admin_overview"), href: "/admin", iconKey: "BarChart3" },
    {
      name: t("nav.manage_businesses"),
      href: "/admin/businesses",
      iconKey: "Building2",
    },
    {
      name: t("nav.global_settings"),
      href: "/admin/settings",
      iconKey: "ShieldCheck",
    },
  ];

  const businessNavItems: NavItem[] = [
    {
      name: t("nav.overview"),
      href: "/business",
      iconKey: "LayoutDashboard",
    },
    {
      name: t("nav.customers"),
      href: "/business/customers",
      iconKey: "Goal",
    },
    {
      name: t("nav.transactions"),
      href: "/business/transactions",
      iconKey: "History",
    },
    {
      name: t("nav.programs"),
      href: "/business/programs",
      iconKey: "CreditCard",
    },
    {
      name: t("nav.products"),
      href: "/business/products",
      iconKey: "Package",
    },
    { name: t("nav.waiters"), href: "/business/waiters", iconKey: "Users" },
  ];

  const waiterNavItems: NavItem[] = [
    { name: t("nav.pos"), href: "/waiter", iconKey: "QrCode" },
    { name: t("nav.history"), href: "/waiter/history", iconKey: "History" },
  ];

  const clientNavItems: NavItem[] = [
    { name: t("nav.wallet"), href: "/client", iconKey: "Wallet" },
    { name: t("nav.scan"), href: "/client/scan", iconKey: "ScanLine" },
    { name: t("nav.rewards"), href: "/client/rewards", iconKey: "Gift" },
  ];

  // 2. Select the correct menu and labels
  let navItems = businessNavItems;
  const menuLabel = t(`roles.${role}`);
  const pageTitle = t(`titles.${role}`);

  switch (role) {
    case "WAITER":
      navItems = waiterNavItems;
      break;
    case "ADMIN":
      navItems = adminNavItems;
      break;
    case "CLIENT":
      navItems = clientNavItems;
      break;
    case "BUSINESS":
    default:
      navItems = businessNavItems;
      break;
  }

  return (
    <DashboardShell
      navItems={navItems}
      menuLabel={menuLabel}
      pageTitle={pageTitle}
      user={user}
    >
      {children}
    </DashboardShell>
  );
}
