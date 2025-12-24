"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
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
} from "lucide-react";

// 1. Map String Keys to Actual Icons
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
};

export interface NavItem {
  name: string;
  href: string;
  iconKey: string; // Changed from 'icon' component to string key
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

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Helper to render the link
  const NavLink = ({
    item,
    isMobile = false,
  }: {
    item: NavItem;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === item.href;
    const IconComponent = ICON_MAP[item.iconKey] || LayoutDashboard; // Fallback

    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <div
          className={cn(
            "group flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300 mb-1 border border-transparent",
            isActive
              ? "bg-primary/10 border-primary/20 text-primary font-semibold shadow-[0_0_15px_-3px_var(--color-primary)]"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5"
          )}
        >
          <IconComponent
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              isActive
                ? "scale-110 text-primary"
                : "group-hover:text-foreground"
            )}
          />
          <span className="tracking-wide text-sm">{item.name}</span>

          {/* Golden Glow Dot for Active State */}
          {isActive && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_2px_var(--color-primary)] animate-pulse" />
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex text-foreground">
      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={toggleMenu}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card/80 backdrop-blur-2xl border-r border-border shadow-2xl transition-transform duration-300 ease-out md:translate-x-0 md:static md:shadow-none md:flex md:flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-tr from-yellow-600 to-yellow-300 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <QrCode className="text-black w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              loylpass
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-[0.2em]">
            {menuLabel}
          </p>
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} isMobile={true} />
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-border/40 bg-muted/20">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-border/50 bg-card/40 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-black font-bold text-xs shadow-md">
              {user.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium truncate text-foreground">
                {user.name}
              </p>
              <p className="text-[10px] uppercase font-bold text-primary tracking-wider">
                {user.role}
              </p>
            </div>
          </div>

          <Link href="/api/auth/signout">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/5 border-border/50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Sign Out
              </span>
            </Button>
          </Link>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 transition-all">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden -ml-2"
              onClick={toggleMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="font-bold text-lg text-foreground tracking-tight">
                {pageTitle}
              </h1>
              <span className="text-xs text-muted-foreground hidden md:block">
                Welcome back, {user.name}
              </span>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-3 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
