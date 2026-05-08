import { Link } from "@tanstack/react-router";
import { useLang, useT } from "@/lib/i18n";
import { BookOpen, MessagesSquare, Brain, PlayCircle, Trophy, Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const t = useT();
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/library", label: t("library"), icon: BookOpen },
    { to: "/tutor", label: t("tutor"), icon: MessagesSquare },
    { to: "/quiz", label: t("quiz"), icon: Brain },
    { to: "/multimedia", label: t("multimedia"), icon: PlayCircle },
    { to: "/progress", label: t("progress"), icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <div className="size-9 rounded-full gradient-gold grid place-items-center shadow-gold">
            <span className="font-display text-primary text-lg font-bold">ن</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-base sm:text-lg font-semibold text-foreground">
              {t("appName")}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
              {t("tagline")}
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-secondary transition-colors flex items-center gap-1.5"
              activeProps={{ className: "px-3 py-2 rounded-md text-sm font-semibold text-primary bg-secondary flex items-center gap-1.5" }}
            >
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border bg-card overflow-hidden text-xs font-semibold">
            {(["uz", "ru"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 transition-colors ${
                  lang === l ? "gradient-gold text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-secondary"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border bg-background/95 px-4 py-2 flex flex-col">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-secondary flex items-center gap-2"
              activeProps={{ className: "px-3 py-3 rounded-md text-sm font-semibold text-primary bg-secondary flex items-center gap-2" }}
            >
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
