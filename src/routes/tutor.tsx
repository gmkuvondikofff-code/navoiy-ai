import { createFileRoute } from "@tanstack/react-router";
import { useLang, useT } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tutor")({
  component: TutorPage,
  head: () => ({
    meta: [
      { title: "AI Murabbiy — Navoiy bo'yicha donishmand" },
      { name: "description", content: "Alisher Navoiy ijodi bo'yicha sun'iy intellekt asosidagi AI murabbiy bilan suhbat." },
    ],
  }),
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestionsUz = [
  "Hayrat ul-abror dostonining asosiy g'oyasi nima?",
  "Farhod va Shirin obrazlari haqida so'zlab bering",
  "Navoiyning tasavvuf falsafasi qanday?",
  "Lison ut-Tayrning ramziy ma'nosi nimada?",
];
const suggestionsRu = [
  "Какова главная идея поэмы Хайрат ул-аброр?",
  "Расскажите об образах Фархада и Ширин",
  "В чём суть суфийской философии Навои?",
  "Каков символический смысл Лисан ут-Тайр?",
];

function TutorPage() {
  const t = useT();
  const { lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let acc = "";
    try {
      const res = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
      });
      if (res.status === 429) {
        toast.error(lang === "uz" ? "Limit oshib ketdi, biroz kuting" : "Превышен лимит, подождите");
        setLoading(false);
        return;
      }
      if (res.status === 402) {
        toast.error(lang === "uz" ? "AI kreditlari tugadi" : "AI кредиты исчерпаны");
        setLoading(false);
        return;
      }
      if (!res.ok || !res.body) {
        toast.error("Error");
        setLoading(false);
        return;
      }

      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            done = true;
            break;
          }
          try {
            const j = JSON.parse(data);
            const delta = j.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = lang === "uz" ? suggestionsUz : suggestionsRu;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-xs font-semibold text-primary mb-3">
          <Sparkles className="size-3.5 text-gold" /> AI
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary">{t("aiTutorTitle")}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t("aiTutorSub")}</p>
      </div>

      <div className="rounded-2xl bg-card border border-border shadow-page overflow-hidden flex flex-col h-[70vh]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <div className="size-20 mx-auto rounded-full gradient-gold grid place-items-center shadow-gold mb-4">
                <Bot className="size-9 text-primary" />
              </div>
              <p className="font-display text-xl text-primary mb-2">
                {lang === "uz" ? "Assalomu alaykum!" : "Здравствуйте!"}
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {lang === "uz"
                  ? "Hazrat Navoiy ijodi haqida har qanday savolingizni so'rang."
                  : "Задайте любой вопрос о творчестве Хазрата Навои."}
              </p>
              <div className="grid sm:grid-cols-2 gap-2 mt-6 max-w-2xl mx-auto">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm p-3 rounded-lg border border-border hover:border-gold hover:bg-gold/5 transition-colors text-foreground/80"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`size-9 rounded-full grid place-items-center shrink-0 ${
                  m.role === "user" ? "bg-secondary" : "gradient-gold shadow-gold"
                }`}
              >
                {m.role === "user" ? <User className="size-4 text-primary" /> : <Bot className="size-4 text-primary" />}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-secondary text-foreground rounded-tl-sm"
                }`}
              >
                {m.content || (loading && i === messages.length - 1 ? <span className="inline-flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> {t("thinking")}</span> : null)}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3 sm:p-4 bg-background/50 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("askPlaceholder")}
            className="flex-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-gold focus:outline-none text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 sm:px-5 py-3 rounded-xl gradient-gold text-primary font-semibold shadow-gold disabled:opacity-50 inline-flex items-center gap-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            <span className="hidden sm:inline">{t("send")}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
