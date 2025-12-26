import Link from "next/link";
import { Layers, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xl tracking-tight">
                loylpass
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              The modern loyalty infrastructure for Morocco's forward-thinking
              businesses.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <Twitter className="w-5 h-5 hover:text-foreground cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-foreground cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-foreground cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer">Features</li>
              <li className="hover:text-primary cursor-pointer">Pricing</li>
              <li className="hover:text-primary cursor-pointer">API</li>
              <li className="hover:text-primary cursor-pointer">Changelog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer">About</li>
              <li className="hover:text-primary cursor-pointer">Blog</li>
              <li className="hover:text-primary cursor-pointer">Careers</li>
              <li className="hover:text-primary cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer">Privacy</li>
              <li className="hover:text-primary cursor-pointer">Terms</li>
              <li className="hover:text-primary cursor-pointer">Security</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2025 Loylpass SARL. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Casablanca, Morocco</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
