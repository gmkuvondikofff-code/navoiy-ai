import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import portrait from "@/assets/navoiy-portrait.jpg";
import { BookOpen, Brain, MessagesSquare, PlayCircle, Sparkles, ScrollText, Feather } from "lucide-react";
import { books } from "@/data/books";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Alisher Navoiy Merosi — AI kutubxona" },
      { name: "description", content: "Buyuk shoir Alisher Navoiyning 12 asari, AI murabbiy va aqlli adaptiv testlar." },
    ],
  }),
});

function Index() {
  const t = useT();
  const { lang } = useLang();

  const features = [
    { icon: BookOpen, titleKey: "library" as const, descUz: "Kitob varaqlash effekti bilan", descRu: "С эффектом перелистывания страниц" },
    { icon: MessagesSquare, titleKey: "tutor" as const, descUz: "Donishmand AI murabbiy", descRu: "Мудрый AI наставник" },
    { icon: Brain, titleKey: "quiz" as const, descUz: "Bilim darajangizga moslashadi", descRu: "Адаптируется под ваш уровень" },
    { icon: PlayCircle, titleKey: "multimedia" as const, descUz: "Video va audiokitoblar", descRu: "Видео и аудиокниги" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-[0.04] pointer-events-none" />
        <div className="container mx-auto px-4 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-xs font-semibold text-primary mb-6">
              <Sparkles className="size-3.5 text-gold" /> {t("heroBadge")} • {t("worksCount")}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[1.05] tracking-tight">
              {t("heroTitle")}
            </h1>
            <p className="mt-3 font-display text-xl sm:text-2xl text-gold italic">
              {lang === "uz" ? "Turkiy so'zning sultoni" : "Султан тюркского слова"}
            </p>
            <p className="mt-6 text-base sm:text-lg text-foreground/80 leading-relaxed max-w-xl">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/library"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-gold text-primary font-semibold shadow-gold hover:scale-105 transition-transform"
              >
                <BookOpen className="size-5" /> {t("startReading")}
              </Link>
              <Link
                to="/tutor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/30 text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <MessagesSquare className="size-5" /> {t("askAi")}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { n: "12", l: lang === "uz" ? "Asar" : "Произведений" },
                { n: "AI", l: lang === "uz" ? "Murabbiy" : "Наставник" },
                { n: "∞", l: lang === "uz" ? "Savol" : "Вопросов" },
              ].map((s) => (
                <div key={s.l} className="text-center p-3 rounded-lg bg-card/60 border border-border">
                  <div className="font-display text-2xl font-bold text-gold">{s.n}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="blob bg-pink-400 size-72 -top-6 -left-6" aria-hidden />
            <div className="blob bg-amber-300 size-64 bottom-0 right-0" style={{ animationDelay: "2s" }} aria-hidden />
            <div className="blob bg-indigo-400 size-56 top-1/3 right-1/4" style={{ animationDelay: "4s" }} aria-hidden />

            <div className="relative story-ring">
              <div className="rounded-full overflow-hidden bg-background size-[280px] sm:size-[360px] lg:size-[440px] grid place-items-center">
                <img
                  src={portrait}
                  alt="Alisher Navoiy portreti"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-cover scale-105"
                />
              </div>
            </div>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass-card px-5 py-2.5 rounded-full shadow-elegant flex items-center gap-3 whitespace-nowrap">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-display text-sm font-semibold text-primary">Alisher Navoiy</span>
              <span className="text-[11px] text-muted-foreground">1441 — 1501</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="ornament-divider mb-4 max-w-[120px] mx-auto" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary">
            {lang === "uz" ? "Bilimlar xazinasi" : "Сокровищница знаний"}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            {lang === "uz"
              ? "Klassik adabiyotni zamonaviy AI texnologiyalar bilan o'rganing."
              : "Изучайте классическую литературу с современными AI-технологиями."}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.titleKey} className="p-6 rounded-2xl bg-card border border-border hover:border-gold/50 hover:shadow-gold transition-all group">
              <div className="size-12 rounded-xl gradient-gold grid place-items-center mb-4 shadow-gold group-hover:scale-110 transition-transform">
                <f.icon className="size-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary mb-1">{t(f.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{lang === "uz" ? f.descUz : f.descRu}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured works */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-primary flex items-center gap-2">
              <ScrollText className="text-gold" /> {lang === "uz" ? "Asarlar" : "Произведения"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {lang === "uz" ? "12 ta asar — Xamsadan tasavvufgacha" : "12 произведений — от Хамсы до суфизма"}
            </p>
          </div>
          <Link to="/library" className="text-sm font-semibold text-primary hover:text-gold transition-colors">
            {t("exploreLibrary")} →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {books.slice(0, 6).map((b) => (
            <Link
              key={b.id}
              to="/library/$bookId"
              params={{ bookId: b.id }}
              className="group block aspect-[3/4] rounded-lg gradient-parchment border border-gold/30 p-4 shadow-page hover:-translate-y-1 hover:shadow-elegant transition-all relative overflow-hidden"
            >
              <Feather className="size-5 text-gold mb-2" />
              <h3 className="font-display text-sm font-bold text-primary leading-tight">
                {lang === "uz" ? b.titleUz : b.titleRu}
              </h3>
              <div className="absolute bottom-3 left-4 right-4 text-[10px] text-muted-foreground">
                {lang === "uz" ? "O'qish" : "Читать"} →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
