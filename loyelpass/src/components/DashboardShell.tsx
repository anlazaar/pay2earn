"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CommandMenu } from "./CommandMenu";
import { motion, AnimatePresence } from "framer-motion";

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
  ChevronLeft,
  Package,
  LifeBuoy,
  UserCog,
  Goal,
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
  Goal,
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
  user: { name?: string | null; email?: string | null; role?: string | null };
}

export function DashboardShell({
  children,
  navItems,
  pageTitle,
  user,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // New State
  const pathname = usePathname();
  const t = useTranslations("DashboardShell");

  // Collapse on small screens
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className={cn(
          "fixed inset-y-0 z-50 flex-col border-r border-zinc-200 bg-white/80 dark:border-white/10 dark:bg-zinc-900/50 backdrop-blur-2xl transition-[transform] duration-300 ease-out lg:static lg:flex",
          isMobileMenuOpen ? "flex translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-white/10">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-primary shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-lg tracking-tight whitespace-nowrap">
                loylpass
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <TooltipProvider delayDuration={0}>
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = ICON_MAP[item.iconKey] || LayoutDashboard;

              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isCollapsed && "justify-center",
                        !isActive &&
                          "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-primary/10 rounded-lg"
                          transition={{ type: "spring", duration: 0.6 }}
                        />
                      )}
                      <IconComponent
                        className={cn(
                          "relative h-4 w-4 shrink-0",
                          isActive && "text-primary"
                        )}
                      />
                      <span
                        className={cn(
                          "relative",
                          isCollapsed && "sr-only",
                          isActive && "text-foreground"
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>

        <div className="p-3 border-t border-zinc-200 dark:border-white/10">
          <UserMenu user={user} t={t} isCollapsed={isCollapsed} />

          <Button
            variant="ghost"
            size="icon"
            className="w-full justify-center hidden lg:flex mt-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </motion.aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dynamic Aurora Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[16px_16px]"></div>
        <div className="absolute top-0 left-0 h-96 w-full bg-linear-to-br from-primary/10 via-transparent to-transparent -z-10" />

        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-medium text-foreground hidden sm:inline">
              {pageTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CommandMenu navItems={navItems} />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

// User Menu Component
function UserMenu({
  user,
  t,
  isCollapsed,
}: {
  user: DashboardShellProps["user"];
  t: any;
  isCollapsed: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full h-auto p-2 justify-start items-center gap-3",
            isCollapsed && "justify-center px-0"
          )}
        >
          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-muted-foreground border border-zinc-200 dark:border-white/10">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden flex-1 text-start">
              <p className="text-sm font-medium truncate text-foreground">
                {user.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserCog className="mr-2 h-4 w-4" />
          {t("ui.account")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy className="mr-2 h-4 w-4" />
          {t("ui.support")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <a href="/api/auth/signout">
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            {t("ui.signOut")}
          </DropdownMenuItem>
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
