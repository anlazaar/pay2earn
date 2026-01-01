"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Command as CommandIcon, Moon, Sun } from "lucide-react";
import { NavItem } from "./DashboardShell";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";

interface CommandMenuProps {
  navItems: NavItem[];
}

export function CommandMenu({ navItems }: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();
  const t = useTranslations("DashboardShell.command");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        size="sm"
        className="h-9 gap-2 rounded-full border-zinc-200 bg-white/50 px-3 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-md transition-all text-muted-foreground"
      >
        <span className="text-xs">Search...</span>
        <div className="flex items-center gap-1">
          <CommandIcon className="w-3 h-3" />
          <span className="text-xs">K</span>
        </div>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("placeholder")} />
        <CommandList>
          <CommandEmpty>{t("no_results")}</CommandEmpty>
          <CommandGroup heading={t("navigation")}>
            {navItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("actions")}>
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              {t("light_mode")}
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              {t("dark_mode")}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
