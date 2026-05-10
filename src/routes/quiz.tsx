import { createFileRoute, Link } from "@tanstack/react-router";
import { books, getBook } from "@/data/books";
import { useLang, useT } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { Brain, Loader2, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const searchSchema = z.object({ bookId: z.string().optional() });

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Adaptiv AI test — Navoiy bilimingizni sinang" },
      { name: "description", content: "Bilim darajangizga moslashadigan AI tomonidan generatsiya qilinadigan testlar." },
    ],
  }),
});

type Difficulty = "easy" | "medium" | "hard";
type Question = { question: string; options: string[]; correctIndex: number; explanation: string };

const COUNT_OPTIONS = [5, 10, 15, 20, 30, 50] as const;

function QuizPage() {
  const { lang } = useLang();
  const t = useT();
  const search = Route.useSearch();
  const [bookId, setBookId] = useState<string | null>(search.bookId || null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const startRound = async (bId: string, diff: Difficulty) => {
    setLoading(true);
    setQuestions([]);
    setIdx(0);
    setSelected(null);
    setFinished(false);
    try {
      const res = await fetch("/api/public/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: bId, difficulty: diff, lang, count: QUESTIONS_PER_ROUND }),
      });
      if (res.status === 429) return toast.error(lang === "uz" ? "Limit, biroz kuting" : "Лимит, подождите");
      if (res.status === 402) return toast.error(lang === "uz" ? "AI kreditlari tugadi" : "AI кредиты исчерпаны");
      if (!res.ok) return toast.error("Error");
      const data = (await res.json()) as { questions: Question[] };
      if (!data.questions?.length) return toast.error(lang === "uz" ? "Savollar yaratib bo'lmadi" : "Не удалось создать вопросы");
      setQuestions(data.questions);
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const begin = () => {
    if (!bookId) return;
    setScore(0);
    startRound(bookId, difficulty);
  };

  const answer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === questions[idx].correctIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSelected(null);
    } else {
      // Round done — adapt difficulty
      const pct = (score / questions.length) * 100;
      let nextDiff: Difficulty = difficulty;
      if (pct >= 80 && difficulty !== "hard") nextDiff = difficulty === "easy" ? "medium" : "hard";
      else if (pct < 40 && difficulty !== "easy") nextDiff = difficulty === "hard" ? "medium" : "easy";
      setDifficulty(nextDiff);
      // Save progress
      try {
        const key = "navoiy-quiz-progress";
        const all = JSON.parse(localStorage.getItem(key) || "{}");
        all[bookId!] = { score, total: questions.length, difficulty, when: Date.now() };
        localStorage.setItem(key, JSON.stringify(all));
      } catch {}
      setFinished(true);
    }
  };

  const reset = () => {
    setBookId(null);
    setQuestions([]);
    setFinished(false);
    setScore(0);
    setIdx(0);
    setSelected(null);
  };

  // Selection screen
  if (!bookId || (!loading && !questions.length && !finished)) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-xs font-semibold text-primary mb-3">
            <Sparkles className="size-3.5 text-gold" /> AI Adaptive
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary">{t("quizTitle")}</h1>
          <p className="text-muted-foreground mt-2 text-sm">{t("quizSub")}</p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 shadow-page">
          <h2 className="font-display text-lg text-primary mb-3">{t("selectBook")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {books.map((b) => (
              <button
                key={b.id}
                onClick={() => setBookId(b.id)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  bookId === b.id ? "border-gold bg-gold/10 shadow-gold" : "border-border hover:border-gold/60"
                }`}
              >
                <div className="font-semibold text-sm text-primary">{lang === "uz" ? b.titleUz : b.titleRu}</div>
                <div className="text-xs text-muted-foreground italic">{lang === "uz" ? b.subtitleUz : b.subtitleRu}</div>
              </button>
            ))}
          </div>

          <h2 className="font-display text-lg text-primary mt-6 mb-3">{t("difficulty")}</h2>
          <div className="flex gap-2">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  difficulty === d ? "gradient-gold text-primary border-gold shadow-gold" : "bg-card text-foreground/70 border-border hover:border-gold/60"
                }`}
              >
                {t(d)}
              </button>
            ))}
          </div>

          <button
            onClick={begin}
            disabled={!bookId}
            className="mt-6 w-full py-3 rounded-xl gradient-gold text-primary font-semibold shadow-gold disabled:opacity-40 inline-flex items-center justify-center gap-2"
          >
            <Brain className="size-5" /> {t("startQuiz")}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="size-10 mx-auto animate-spin text-gold" />
        <p className="font-display text-lg text-primary mt-4">{t("generating")}</p>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const book = getBook(bookId!)!;
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="size-24 mx-auto rounded-full gradient-gold grid place-items-center shadow-gold mb-6">
          <Trophy className="size-12 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-bold text-primary mb-2">{t("result")}</h1>
        <p className="text-muted-foreground mb-6">{lang === "uz" ? book.titleUz : book.titleRu}</p>

        <div className="rounded-2xl bg-card border border-gold/40 p-8 shadow-elegant mb-6">
          <div className="font-display text-6xl font-bold text-gold">{pct}%</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {score} / {questions.length} {lang === "uz" ? "to'g'ri javob" : "правильных ответов"}
          </div>
          <div className="mt-4 text-xs uppercase tracking-wider text-primary font-semibold">
            {lang === "uz" ? "Keyingi daraja" : "Следующий уровень"}: {t(difficulty)}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => startRound(bookId!, difficulty)}
            className="px-6 py-3 rounded-xl gradient-gold text-primary font-semibold shadow-gold inline-flex items-center justify-center gap-2"
          >
            <RotateCcw className="size-4" /> {lang === "uz" ? "Yana 5 ta savol" : "Ещё 5 вопросов"}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl border border-border text-primary font-semibold hover:border-gold inline-flex items-center justify-center gap-2"
          >
            {lang === "uz" ? "Boshqa kitob" : "Другая книга"}
          </button>
          <Link to="/progress" className="px-6 py-3 rounded-xl border border-border text-primary font-semibold hover:border-gold inline-flex items-center justify-center gap-2">
            <Trophy className="size-4" /> {t("progress")}
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const correct = q.correctIndex;
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="font-semibold text-muted-foreground">{t("question")} {idx + 1} / {questions.length}</span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-gold text-primary">{t(difficulty)}</span>
      </div>
      <div className="h-1 bg-secondary rounded-full overflow-hidden mb-6">
        <div className="h-full gradient-gold transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-page">
        <h2 className="font-display text-xl sm:text-2xl text-primary leading-snug">{q.question}</h2>
        <div className="mt-6 space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === correct;
            const isSelected = selected === i;
            const show = selected !== null;
            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={show}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                  show
                    ? isCorrect
                      ? "border-emerald-500 bg-emerald-500/10"
                      : isSelected
                      ? "border-destructive bg-destructive/10"
                      : "border-border opacity-60"
                    : "border-border hover:border-gold hover:bg-gold/5"
                }`}
              >
                <span className="size-7 rounded-full grid place-items-center text-xs font-bold gradient-gold text-primary shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm sm:text-[15px] flex-1 text-foreground">{opt}</span>
                {show && isCorrect && <CheckCircle2 className="size-5 text-emerald-600" />}
                {show && isSelected && !isCorrect && <XCircle className="size-5 text-destructive" />}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-5 p-4 rounded-xl bg-secondary border border-gold/30 animate-fade-in">
            <div className="text-xs font-bold uppercase tracking-wider text-gold mb-1">{t("explanation")}</div>
            <p className="text-sm text-foreground/85 leading-relaxed">{q.explanation}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={next}
            disabled={selected === null}
            className="px-5 py-2.5 rounded-xl gradient-gold text-primary font-semibold shadow-gold disabled:opacity-40 inline-flex items-center gap-2"
          >
            {idx + 1 < questions.length ? t("nextQuestion") : t("finish")} <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
