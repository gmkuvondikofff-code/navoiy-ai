import { createFileRoute } from "@tanstack/react-router";
import { useLang, useT } from "@/lib/i18n";
import { useState } from "react";
import { PlayCircle, Youtube, X } from "lucide-react";

export const Route = createFileRoute("/multimedia")({
  component: MultimediaPage,
  head: () => ({
    meta: [
      { title: "Multimedia — Video galereya" },
      { name: "description", content: "Alisher Navoiy haqida video kontent." },
    ],
  }),
});

const videos = [
  {
    id: "IZ9Ia11TZSQ",
    title_uz: "Alisher Navoiy — hayoti va ijodi",
    title_ru: "Алишер Навои — жизнь и творчество",
  },
  {
    id: "-Fx7XI1KUdY",
    title_uz: "Navoiy merosi",
    title_ru: "Наследие Навои",
  },
  {
    id: "kTq0x9oGB5U",
    title_uz: "Xamsa dostonlari tahlili",
    title_ru: "Анализ поэм Хамса",
  },
  {
    id: "PhOlo6TDc64",
    title_uz: "Farhod va Shirin hikoyasi",
    title_ru: "История Фархада и Ширин",
  },
  {
    id: "neZa2TLuh8w",
    title_uz: "Layli va Majnun — muhabbat dostoni",
    title_ru: "Лейли и Меджнун — поэма о любви",
  },
  {
    id: "d6_V_fEqtLQ",
    title_uz: "Navoiy falsafasi",
    title_ru: "Философия Навои",
  },
  {
    id: "4R1SywCk-Tg",
    title_uz: "Tasavvuf va ijod",
    title_ru: "Суфизм и творчество",
  },
];

function MultimediaPage() {
  const { lang } = useLang();
  const t = useT();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="ornament-divider mb-4 max-w-[120px] mx-auto" />
        <h1 className="font-display text-4xl font-bold text-primary">{t("multimedia")}</h1>
        <p className="text-muted-foreground mt-2">
          {lang === "uz" ? "Navoiy haqida video lavhalar" : "Видеоматериалы о Навои"}
        </p>
      </div>

      <section>
        <h2 className="font-display text-2xl text-primary flex items-center gap-2 mb-4">
          <Youtube className="text-gold" /> {t("videos")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {videos.map((v) => {
            const thumb = `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
            const isActive = activeVideo === v.id;
            return (
              <div key={v.id} className="rounded-2xl bg-card border border-border overflow-hidden shadow-page">
                {isActive ? (
                  <div className="relative aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`}
                      title={lang === "uz" ? v.title_uz : v.title_ru}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="absolute top-2 right-2 size-8 rounded-full bg-black/60 text-white grid place-items-center hover:bg-black/80 transition-colors"
                      aria-label="Close"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveVideo(v.id)}
                    className="w-full aspect-video relative group overflow-hidden"
                  >
                    <img
                      src={thumb}
                      alt={lang === "uz" ? v.title_uz : v.title_ru}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors grid place-items-center">
                      <PlayCircle className="size-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                    </div>
                  </button>
                )}
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-primary">
                    {lang === "uz" ? v.title_uz : v.title_ru}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
