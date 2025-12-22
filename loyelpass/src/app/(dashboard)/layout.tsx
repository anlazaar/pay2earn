import { auth } from "@/auth";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  QrCode,
  Users,
  Settings,
  LogOut,
  CreditCard,
  History,
  Wallet,
  ScanLine,
  Gift,
  ShieldCheck,
  Building2,
  BarChart3,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role;

  // 🟢 1. Define menus for specific roles
  const adminNavItems = [
    { name: "System Overview", href: "/admin", icon: BarChart3 },
    { name: "Manage Businesses", href: "/admin/businesses", icon: Building2 },
    { name: "Global Settings", href: "#", icon: ShieldCheck },
  ];

  const businessNavItems = [
    { name: "Overview", href: "/business", icon: LayoutDashboard },
    { name: "Programs", href: "/business", icon: CreditCard },
    { name: "Staff / Waiters", href: "/business/waiters", icon: Users },
    { name: "Settings", href: "#", icon: Settings },
  ];

  const waiterNavItems = [
    { name: "POS Terminal", href: "/waiter", icon: QrCode },
    { name: "History", href: "#", icon: History },
  ];

  const clientNavItems = [
    { name: "My Wallet", href: "/client", icon: Wallet },
    { name: "Scan Code", href: "/client/scan", icon: ScanLine },
    { name: "Rewards", href: "#", icon: Gift },
  ];

  // 🟢 2. Select the correct menu and text based on role
  let navItems = businessNavItems; // Default fallback
  let menuLabel = "Business Menu";
  let pageTitle = "Dashboard";

  switch (role) {
    case "WAITER":
      navItems = waiterNavItems;
      menuLabel = "Staff Menu";
      pageTitle = "Point of Sale";
      break;
    case "ADMIN":
      navItems = adminNavItems;
      menuLabel = "Administration";
      pageTitle = "System Admin";
      break;
    case "CLIENT":
      navItems = clientNavItems;
      menuLabel = "Client Menu";
      pageTitle = "My Wallet";
      break;
    case "BUSINESS":
    default:
      navItems = businessNavItems;
      menuLabel = "Business Menu";
      pageTitle = "Dashboard";
      break;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 bg-card/30 backdrop-blur-xl h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <QrCode className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">loylpass</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            {menuLabel}
          </p>
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 mb-1 text-muted-foreground hover:text-foreground hover:bg-accent/50"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/30 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.role}
              </p>
            </div>
          </div>
          {/* Use API route for signout to ensure clean session clearing */}
          <Link href="/api/auth/signout">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-border/50"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <h1 className="font-semibold text-lg md:hidden">loylpass</h1>
          <div className="hidden md:block text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{pageTitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-secondary/20">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
