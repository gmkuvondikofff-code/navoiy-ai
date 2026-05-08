import { createFileRoute, Link } from "@tanstack/react-router";
import { books } from "@/data/books";
import { useLang, useT } from "@/lib/i18n";
import { BookOpen, Feather, Crown, GraduationCap, Sparkles, Moon, Mountain } from "lucide-react";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
  head: () => ({
    meta: [
      { title: "Kutubxona — Alisher Navoiy asarlari" },
      { name: "description", content: "Alisher Navoiyning 12 ta asari: Xamsa, lirika, ilmiy va tasavvufiy meros." },
    ],
  }),
});

const categoryIcon: Record<string, typeof Feather> = {
  biography: Crown,
  study: GraduationCap,
  lyric: Feather,
  tradition: BookOpen,
  epic: Mountain,
  scholar: Sparkles,
  sufi: Moon,
};

function LibraryPage() {
  const { lang } = useLang();
  const t = useT();
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="ornament-divider mb-4 max-w-[120px] mx-auto" />
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary">{t("library")}</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          {lang === "uz"
            ? "Har bir asarni real kitob kabi varaqlab o'qing."
            : "Читайте каждое произведение как настоящую книгу."}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {books.map((b) => {
          const Icon = categoryIcon[b.category] || Feather;
          return (
            <Link
              key={b.id}
              to="/library/$bookId"
              params={{ bookId: b.id }}
              className="group relative block rounded-2xl gradient-parchment border border-gold/30 p-6 shadow-page hover:shadow-elegant hover:-translate-y-1 transition-all overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 size-32 rounded-full gradient-gold opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
              <div className="flex items-start justify-between mb-4 relative">
                <div className="size-12 rounded-xl gradient-gold grid place-items-center shadow-gold">
                  <Icon className="size-6 text-primary" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-card px-2 py-1 rounded-full border border-border">
                  {b.order < 10 ? `0${b.order}` : b.order}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-primary leading-tight mb-1">
                {lang === "uz" ? b.titleUz : b.titleRu}
              </h2>
              <p className="text-sm text-muted-foreground italic mb-4">
                {lang === "uz" ? b.subtitleUz : b.subtitleRu}
              </p>
              <div className="flex items-center justify-between text-xs text-foreground/70 pt-3 border-t border-border/60">
                <span>{b.paragraphs.length} {lang === "uz" ? "bo'lim" : "разделов"}</span>
                <span className="text-primary font-semibold group-hover:text-gold transition-colors">
                  {t("read")} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
