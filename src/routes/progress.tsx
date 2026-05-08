import { createFileRoute, Link } from "@tanstack/react-router";
import { books, getBook } from "@/data/books";
import { useLang, useT } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Trophy, BookOpen, Brain, Star } from "lucide-react";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
  head: () => ({
    meta: [{ title: "Yutuqlar — O'qish va test natijalari" }],
  }),
});

type QuizProgress = Record<string, { score: number; total: number; difficulty: string; when: number }>;

function ProgressPage() {
  const { lang } = useLang();
  const t = useT();
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>({});
  const [quizProgress, setQuizProgress] = useState<QuizProgress>({});

  useEffect(() => {
    try {
      const r: Record<string, number> = {};
      books.forEach((b) => {
        const p = localStorage.getItem("navoiy-progress-" + b.id);
        if (p) r[b.id] = parseInt(p, 10) || 0;
      });
      setReadingProgress(r);
      const q = JSON.parse(localStorage.getItem("navoiy-quiz-progress") || "{}");
      setQuizProgress(q);
    } catch {}
  }, []);

  const totalRead = Object.keys(readingProgress).length;
  const totalQuizzes = Object.keys(quizProgress).length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          (Object.values(quizProgress).reduce((s, q) => s + (q.score / q.total) * 100, 0) / totalQuizzes) || 0
        )
      : 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="text-center mb-10">
        <div className="ornament-divider mb-4 max-w-[120px] mx-auto" />
        <h1 className="font-display text-4xl font-bold text-primary">{t("progress")}</h1>
        <p className="text-muted-foreground mt-2">{lang === "uz" ? "O'qish va testlardagi yutuqlaringiz" : "Ваши достижения в чтении и тестах"}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: BookOpen, label: lang === "uz" ? "Boshlangan kitoblar" : "Начатых книг", value: `${totalRead}/${books.length}` },
          { icon: Brain, label: lang === "uz" ? "Yakunlangan testlar" : "Завершено тестов", value: totalQuizzes },
          { icon: Trophy, label: lang === "uz" ? "O'rtacha natija" : "Средний результат", value: `${avgScore}%` },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-card border border-gold/30 p-5 shadow-page">
            <div className="size-10 rounded-lg gradient-gold grid place-items-center shadow-gold mb-3">
              <s.icon className="size-5 text-primary" />
            </div>
            <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl text-primary mb-3 flex items-center gap-2">
        <Star className="text-gold" /> {lang === "uz" ? "Kitoblar bo'yicha" : "По книгам"}
      </h2>
      <div className="space-y-2">
        {books.map((b) => {
          const r = readingProgress[b.id] || 0;
          const q = quizProgress[b.id];
          return (
            <Link
              key={b.id}
              to="/library/$bookId"
              params={{ bookId: b.id }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-gold/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-display text-base font-semibold text-primary">{lang === "uz" ? b.titleUz : b.titleRu}</div>
                <div className="text-xs text-muted-foreground">{lang === "uz" ? b.subtitleUz : b.subtitleRu}</div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="size-3.5" />
                  <span>{r > 0 ? `${Math.round((r / b.paragraphs.length) * 100)}%` : "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Brain className="size-3.5" />
                  <span>{q ? `${Math.round((q.score / q.total) * 100)}%` : "—"}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// avoid unused warning when getBook isn't used
void getBook;
