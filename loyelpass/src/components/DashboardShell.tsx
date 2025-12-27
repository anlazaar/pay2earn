"use client";

import { useState } from "react";
import { Link, usePathname } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  Menu,
  X,
  Layers,
  ChevronRight,
  Package,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  QrCode,
  Users,
  Settings,
  CreditCard,
  History,
  Wallet,
  ScanLine,
  Gift,
  ShieldCheck,
  Building2,
  BarChart3,
  Package,
};

export interface NavItem {
  name: string;
  href: string;
  iconKey: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  menuLabel: string;
  pageTitle: string;
  user: {
    name?: string | null;
    role?: string | null;
  };
}

export function DashboardShell({
  children,
  navItems,
  menuLabel,
  pageTitle,
  user,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("DashboardShell");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 w-64 bg-background border-border transition-transform duration-300 ease-out md:static flex flex-col",
          // Position Sidebar correctly
          isRtl ? "right-0 border-l" : "left-0 border-r",
          // Animation direction based on locale
          isMobileMenuOpen
            ? "translate-x-0"
            : isRtl
            ? "translate-x-full"
            : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-md flex items-center justify-center text-primary">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              loylpass
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={toggleMenu}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
          <div>
            <p className="px-3 text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider text-start">
              {menuLabel}
            </p>
            <div className="space-y-0.5">
              {navItems.map((item) => {
                // Remove locale prefix from href to compare with localized pathname
                const isActive =
                  pathname === item.href ||
                  pathname === item.href.replace(`/${locale}`, "");
                const IconComponent = ICON_MAP[item.iconKey] || LayoutDashboard;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-md transition-all text-sm font-medium mb-1",
                      isActive
                        ? "bg-secondary text-foreground ring-1 ring-border/50"
                        : "text-muted-foreground hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={cn(
                          "h-4 w-4",
                          isActive
                            ? "text-primary"
                            : "group-hover:text-foreground"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group mb-2 text-start">
            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground border border-border group-hover:border-primary/50">
              {user.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium truncate text-foreground">
                {user.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user.role} {t("ui.workspace")}
              </p>
            </div>
          </div>

          <Link href="../api/auth/signout" className="block">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground h-8 text-xs border-dashed"
            >
              <LogOut className="h-3 w-3 rtl:rotate-180" />
              {t("ui.signOut")}
            </Button>
          </Link>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden -ms-2"
              onClick={toggleMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground hidden sm:inline-block">
                {t("ui.dashboard")}
              </span>
              {/* breadcrumb arrow flips for RTL */}
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 hidden sm:inline-block rtl:rotate-180" />
              <span className="font-medium text-foreground">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-secondary/5">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
