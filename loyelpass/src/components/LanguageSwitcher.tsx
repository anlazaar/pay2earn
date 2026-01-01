"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Safe way to detect current locale
  const currentLocale = pathname?.split("/")[1] || "en";
  const activeLang = LANGUAGES.find((l) => l.code === currentLocale);

  const changeLanguage = (newLocale: string) => {
    if (!pathname) return;

    // 2. Split path and replace the locale segment
    const segments = pathname.split("/");

    // Handle root path or existing locale path
    if (segments.length > 1) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    // 3. Reconstruct path + Preserve Query Params (e.g. ?page=2)
    const newPath = segments.join("/");
    const params = searchParams.toString();
    const finalUrl = params ? `${newPath}?${params}` : newPath;

    router.push(finalUrl);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-full border-zinc-200 bg-white/50 px-3 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-md transition-all"
        >
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden text-xs font-medium sm:inline-block">
            {activeLang?.label || "Language"}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-150px border-zinc-200 bg-white/80 p-1 dark:border-white/10 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl rounded-xl"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
              currentLocale === lang.code
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2.5">
              <span className="text-base leading-none shadow-sm rounded-sm overflow-hidden">
                {lang.flag}
              </span>
              <span>{lang.label}</span>
            </span>
            {currentLocale === lang.code && (
              <Check className="h-3.5 w-3.5 animate-in zoom-in" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
