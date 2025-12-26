import { auth } from "@/auth";
import { DashboardShell, NavItem } from "@/components/DashboardShell";

// This layout is a Server Component.
// It fetches data and passes pure JSON props to the Client Shell.

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role;

  // Safe user object to pass to client
  const user = {
    name: session?.user?.name,
    role: session?.user?.role,
    email: session?.user?.email,
  };

  // 1. Define menus using STRING keys for icons
  const adminNavItems: NavItem[] = [
    { name: "System Overview", href: "/admin", iconKey: "BarChart3" },
    {
      name: "Manage Businesses",
      href: "/admin/businesses",
      iconKey: "Building2",
    },
    {
      name: "Global Settings",
      href: "/admin/settings",
      iconKey: "ShieldCheck",
    },
  ];

  const businessNavItems: NavItem[] = [
    {
      name: "Overview",
      href: "/business",
      iconKey: "LayoutDashboard",
    },
    {
      name: "Transactions",
      href: "/business/transactions",
      iconKey: "History", // Matches the icon used in the Transactions page
    },
    {
      name: "Programs",
      href: "/business/programs",
      iconKey: "CreditCard",
    },
    {
      name: "Menu & Products",
      href: "/business/products",
      iconKey: "Package", // Matches the icon used in the Products page
    },
    {
      name: "Staff / Waiters",
      href: "/business/waiters",
      iconKey: "Users",
    },
    // {
    //   name: "Settings",
    //   href: "/business/settings",
    //   iconKey: "Settings",
    // },
  ];

  const waiterNavItems: NavItem[] = [
    { name: "POS Terminal", href: "/waiter", iconKey: "QrCode" },
    { name: "History", href: "/waiter/history", iconKey: "History" },
  ];

  const clientNavItems: NavItem[] = [
    { name: "My Wallet", href: "/client", iconKey: "Wallet" },
    { name: "Scan Code", href: "/client/scan", iconKey: "ScanLine" },
    { name: "Rewards", href: "/client/rewards", iconKey: "Gift" },
  ];

  // 2. Select the correct menu
  let navItems = businessNavItems;
  let menuLabel = "Business";
  let pageTitle = "Dashboard";

  switch (role) {
    case "WAITER":
      navItems = waiterNavItems;
      menuLabel = "Staff Zone";
      pageTitle = "Point of Sale";
      break;
    case "ADMIN":
      navItems = adminNavItems;
      menuLabel = "Admin Panel";
      pageTitle = "System Admin";
      break;
    case "CLIENT":
      navItems = clientNavItems;
      menuLabel = "Membership";
      pageTitle = "My Wallet";
      break;
    case "BUSINESS":
    default:
      navItems = businessNavItems;
      menuLabel = "Management";
      pageTitle = "Business Dashboard";
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
