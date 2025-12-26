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
  Layers,
  ChevronRight,
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
    const IconComponent = ICON_MAP[item.iconKey] || LayoutDashboard;

    return (
      <Link
        href={item.href}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className="block mb-1"
      >
        <div
          className={cn(
            "group flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
            isActive
              ? "bg-secondary text-foreground shadow-sm ring-1 ring-border/50"
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            <IconComponent
              className={cn(
                "h-4 w-4 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span>{item.name}</span>
          </div>

          {/* Subtle Indicator for Active State */}
          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20 selection:text-primary">
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transition-transform duration-300 ease-out md:translate-x-0 md:static flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Area */}
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

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
          {/* Main Group */}
          <div>
            <p className="px-3 text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              {menuLabel}
            </p>
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <NavLink key={item.name} item={item} isMobile={true} />
              ))}
            </div>
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group mb-2">
            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground border border-border group-hover:border-primary/50 transition-colors">
              {user.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium truncate text-foreground">
                {user.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user.role} workspace
              </p>
            </div>
          </div>

          <Link href="/api/auth/signout" className="block">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground h-8 text-xs border-dashed border-border/60 hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5"
            >
              <LogOut className="h-3 w-3" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden -ml-2"
              onClick={toggleMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumb-like Title */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground hidden sm:inline-block">
                Dashboard
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 hidden sm:inline-block" />
              <span className="font-medium text-foreground">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Optional: Add a 'Feedback' or 'Help' small button here */}
            <div className="h-4 w-px bg-border hidden sm:block" />
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-secondary/5">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
