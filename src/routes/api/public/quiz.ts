import { createFileRoute } from "@tanstack/react-router";
import { getBook } from "@/data/books";

type Difficulty = "easy" | "medium" | "hard";

export const Route = createFileRoute("/api/public/quiz")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { bookId, difficulty, lang, count } = (await request.json()) as {
          bookId: string;
          difficulty: Difficulty;
          lang: "uz" | "ru";
          count?: number;
        };
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("LOVABLE_API_KEY missing", { status: 500 });
        const book = getBook(bookId);
        if (!book) return new Response("Book not found", { status: 404 });

        // Sample text — randomized chunk
        const all = book.paragraphs.join("\n\n");
        const maxLen = 8000;
        const start = Math.floor(Math.random() * Math.max(1, all.length - maxLen));
        const excerpt = all.slice(start, start + maxLen);

        const n = Math.min(Math.max(count || 5, 3), 8);

        const sysUz = `Sen Alisher Navoiy asarlari bo'yicha test savollar yaratuvchi mutaxassisiziz. Berilgan matn asosida ${n} ta ko'p tanlovli savol yarat. Daraja: ${difficulty} (easy=fakt; medium=tushunish; hard=tahlil/mavhum). Faqat o'zbek tilida.`;
        const sysRu = `Ты — эксперт по творчеству Алишера Навои, создающий тестовые вопросы. На основе данного текста создай ${n} вопросов с множественным выбором. Уровень: ${difficulty}. Только на русском языке.`;
        const system = lang === "ru" ? sysRu : sysUz;

        const userPrompt = `${lang === "ru" ? "Книга" : "Kitob"}: ${lang === "ru" ? book.titleRu : book.titleUz}\n\n${lang === "ru" ? "Текст" : "Matn"}:\n"""\n${excerpt}\n"""`;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: system },
              { role: "user", content: userPrompt },
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "create_quiz",
                  description: "Return generated quiz questions",
                  parameters: {
                    type: "object",
                    properties: {
                      questions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            question: { type: "string" },
                            options: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
                            correctIndex: { type: "integer", minimum: 0, maximum: 3 },
                            explanation: { type: "string" },
                          },
                          required: ["question", "options", "correctIndex", "explanation"],
                          additionalProperties: false,
                        },
                      },
                    },
                    required: ["questions"],
                    additionalProperties: false,
                  },
                },
              },
            ],
            tool_choice: { type: "function", function: { name: "create_quiz" } },
          }),
        });

        if (!upstream.ok) {
          if (upstream.status === 429) return new Response(JSON.stringify({ error: "rate_limit" }), { status: 429 });
          if (upstream.status === 402) return new Response(JSON.stringify({ error: "no_credits" }), { status: 402 });
          const t = await upstream.text();
          console.error("quiz gateway err", t);
          return new Response(JSON.stringify({ error: "ai_error" }), { status: 500 });
        }

        const json = await upstream.json();
        const args = json?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
        let parsed: { questions: unknown[] } = { questions: [] };
        try {
          parsed = JSON.parse(args || "{}");
        } catch {
          return new Response(JSON.stringify({ error: "parse_error" }), { status: 500 });
        }
        return new Response(JSON.stringify(parsed), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
