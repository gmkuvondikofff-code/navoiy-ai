import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBook } from "@/data/books";
import { useLang, useT } from "@/lib/i18n";
import { ChevronLeft, ChevronRight, ArrowLeft, Brain, MessagesSquare } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

export const Route = createFileRoute("/library/$bookId")({
  component: ReaderPage,
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-3xl text-primary">Kitob topilmadi</h1>
      <Link to="/library" className="text-gold mt-4 inline-block">← Kutubxonaga qaytish</Link>
    </div>
  ),
  loader: ({ params }) => {
    const book = getBook(params.bookId);
    if (!book) throw notFound();
    return { book };
  },
});

const CHARS_PER_PAGE = 950;

function paginate(paragraphs: string[]): string[][] {
  const pages: string[][] = [];
  let cur: string[] = [];
  let len = 0;
  for (const p of paragraphs) {
    if (len + p.length > CHARS_PER_PAGE && cur.length) {
      pages.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(p);
    len += p.length;
  }
  if (cur.length) pages.push(cur);
  return pages;
}

function ReaderPage() {
  const { book } = Route.useLoaderData();
  const { lang } = useLang();
  const t = useT();
  const pages = useMemo(() => paginate(book.paragraphs), [book]);
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState<"next" | "prev" | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  // Save reading progress
  useEffect(() => {
    try {
      const key = "navoiy-progress-" + book.id;
      const saved = localStorage.getItem(key);
      if (saved) setPage(Math.min(parseInt(saved, 10) || 0, pages.length - 1));
    } catch {}
  }, [book.id, pages.length]);

  useEffect(() => {
    try {
      localStorage.setItem("navoiy-progress-" + book.id, String(page));
    } catch {}
  }, [page, book.id]);

  const step = isDesktop ? 2 : 1;
  const totalSpreads = Math.ceil(pages.length / step);
  const currentSpread = Math.floor(page / step);

  const go = (dir: "next" | "prev") => {
    if (flipping) return;
    if (dir === "next" && page + step >= pages.length) return;
    if (dir === "prev" && page === 0) return;
    setFlipping(dir);
    setTimeout(() => {
      setPage((p) => (dir === "next" ? Math.min(p + step, pages.length - 1) : Math.max(p - step, 0)));
      setFlipping(null);
    }, 350);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go("next");
      if (e.key === "ArrowLeft") go("prev");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, flipping, isDesktop]);

  const renderPage = (idx: number) => {
    const p = pages[idx];
    if (!p) return <div className="opacity-0" />;
    return (
      <article className="prose prose-stone max-w-none">
        {p.map((para, i) => (
          <p key={i} className="font-serif text-foreground/90 leading-[1.85] text-[15px] sm:text-[17px] mb-3 first-letter:font-display first-letter:text-3xl first-letter:font-bold first-letter:text-gold first-letter:mr-1 first-letter:float-left first-letter:leading-[0.9] first-letter:mt-1">
            {para}
          </p>
        ))}
      </article>
    );
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-4 gap-3">
        <Link to="/library" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-gold">
          <ArrowLeft className="size-4" /> {t("back")}
        </Link>
        <div className="flex gap-2">
          <Link to="/quiz" search={{ bookId: book.id }} className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:border-gold hover:text-gold">
            <Brain className="size-3.5" /> {t("quiz")}
          </Link>
          <Link to="/tutor" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-border hover:border-gold hover:text-gold">
            <MessagesSquare className="size-3.5" /> {t("tutor")}
          </Link>
        </div>
      </div>

      <header className="text-center mb-6">
        <div className="ornament-divider max-w-[100px] mx-auto mb-3" />
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-primary">
          {lang === "uz" ? book.titleUz : book.titleRu}
        </h1>
        <p className="text-sm text-muted-foreground italic mt-1">
          {lang === "uz" ? book.subtitleUz : book.subtitleRu}
        </p>
      </header>

      <div className="book-stage relative max-w-5xl mx-auto">
        <div
          className={`book-page relative rounded-xl overflow-hidden grid ${isDesktop ? "grid-cols-2" : "grid-cols-1"} gap-6 sm:gap-10 p-6 sm:p-10 lg:p-14 min-h-[60vh] ${flipping ? "flipping" : ""}`}
        >
          <div className="relative z-10">{renderPage(page)}</div>
          {isDesktop && <div className="relative z-10 border-l border-gold/20 pl-10">{renderPage(page + 1)}</div>}

          {/* Decorative center spine */}
          {isDesktop && (
            <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Page numbers */}
        <div className="flex items-center justify-between mt-4 text-xs font-semibold text-muted-foreground">
          <button
            onClick={() => go("prev")}
            disabled={page === 0 || !!flipping}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border disabled:opacity-30 hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronLeft className="size-4" /> {t("prev")}
          </button>
          <div className="font-display text-sm">
            {t("page")} {currentSpread + 1} / {totalSpreads}
          </div>
          <button
            onClick={() => go("next")}
            disabled={page + step >= pages.length || !!flipping}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-card border border-border disabled:opacity-30 hover:border-gold hover:text-gold transition-colors"
          >
            {t("next")} <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-gold transition-all"
            style={{ width: `${((currentSpread + 1) / totalSpreads) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
