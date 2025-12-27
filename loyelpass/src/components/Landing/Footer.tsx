"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation"; // Use your localized Link
import { Layers, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 text-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xl tracking-tight">
                loylpass
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              {t("tagline")}
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <Twitter className="w-5 h-5 hover:text-foreground cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-foreground cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-foreground cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="text-start">
            <h4 className="font-semibold mb-4 text-sm">{t("product.title")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("product.features")}
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("product.pricing")}
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("product.api")}
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("product.changelog")}
              </li>
            </ul>
          </div>

          <div className="text-start">
            <h4 className="font-semibold mb-4 text-sm">{t("company.title")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("company.about")}
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("company.blog")}
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("company.careers")}
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("company.contact")}
              </li>
            </ul>
          </div>

          <div className="text-start">
            <h4 className="font-semibold mb-4 text-sm">{t("legal.title")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("legal.privacy")}
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("legal.terms")}
              </li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {t("legal.security")}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p dir="ltr">{t("copyright")}</p>
          <div className="flex gap-8">
            <span>{t("location")}</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t("status")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
