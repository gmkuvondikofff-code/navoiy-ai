import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="border-t border-border/60 mt-20">
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="ornament-divider mb-6 max-w-xs mx-auto" />
        <p className="font-display text-lg text-primary">{t("appName")}</p>
        <p className="text-xs text-muted-foreground mt-2">© {new Date().getFullYear()} • Hazrat Alisher Navoiy 1441 — 1501</p>
      </div>
    </footer>
  );
}
