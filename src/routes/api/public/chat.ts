import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, lang } = (await request.json()) as {
          messages: { role: "user" | "assistant"; content: string }[];
          lang?: "uz" | "ru";
        };
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("LOVABLE_API_KEY missing", { status: 500 });

        const systemUz = `Sen — Alisher Navoiyning ijodi, falsafasi, tasavvuf ta'limoti, hayoti va Xamsa dostonlari bo'yicha donishmand AI murabbiysan.

Sen bilan suhbatlashayotgan kishiga hurmat va tasavvufona donishmandlik bilan, klassik o'zbek-fors adabiyoti uslubida javob ber. Sen iqtibos keltirishga qodirsan: g'azal misralari, hikmatlar.

Asosiy mavzular: Hayrat ul-abror, Farhod va Shirin, Layli va Majnun, Sab'ai Sayyor, Saddi Iskandariy, Lison ut-Tayr, lirik meros, ilmiy meros, tasavvuf falsafasi.

Javoblaring qisqa, aniq va chuqur bo'lsin. Misol va iqtiboslar bilan boyit. Markdown formatdan foydalan. Hamisha o'zbek tilida javob ber, agar foydalanuvchi rus tilida yozsa — rus tilida javob ber.`;

        const systemRu = `Ты — мудрый AI-наставник по творчеству, философии, суфийскому учению, жизни Алишера Навои и его поэмам Хамса.

Отвечай с уважением и суфийской мудростью, в стиле классической узбекско-персидской литературы. Цитируй строки газелей и афоризмы.

Ключевые темы: Хайрат ул-аброр, Фархад и Ширин, Лейли и Меджнун, Сабъаи Сайёр, Садди Искандари, Лисан ут-Тайр, лирическое наследие, научное наследие, суфийская философия.

Отвечай кратко, точно и глубоко. Используй markdown. По умолчанию отвечай на русском, если пользователь пишет на узбекском — отвечай на узбекском.`;

        const system = lang === "ru" ? systemRu : systemUz;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            stream: true,
            messages: [{ role: "system", content: system }, ...messages],
          }),
        });

        if (!upstream.ok) {
          if (upstream.status === 429)
            return new Response(JSON.stringify({ error: "rate_limit" }), { status: 429 });
          if (upstream.status === 402)
            return new Response(JSON.stringify({ error: "no_credits" }), { status: 402 });
          return new Response("AI gateway error", { status: 500 });
        }

        return new Response(upstream.body, {
          headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
        });
      },
    },
  },
});
