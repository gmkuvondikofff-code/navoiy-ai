import { createFileRoute } from "@tanstack/react-router";
import { useLang, useT } from "@/lib/i18n";
import { PlayCircle, Music, Headphones, Youtube } from "lucide-react";

export const Route = createFileRoute("/multimedia")({
  component: MultimediaPage,
  head: () => ({
    meta: [
      { title: "Multimedia — Video va audiokitoblar" },
      { name: "description", content: "Alisher Navoiy haqida video va audio kontent." },
    ],
  }),
});

const videos = [
  { id: "1", title_uz: "Alisher Navoiy hayoti", title_ru: "Жизнь Алишера Навои", placeholder: "https://www.youtube.com/embed/?listType=search&list=Alisher+Navoiy" },
  { id: "2", title_uz: "Xamsa dostonlari", title_ru: "Поэмы Хамса", placeholder: "" },
  { id: "3", title_uz: "Farhod va Shirin", title_ru: "Фархад и Ширин", placeholder: "" },
  { id: "4", title_uz: "Tasavvuf falsafasi", title_ru: "Философия суфизма", placeholder: "" },
];

const audios = [
  { id: "a1", title_uz: "Hayrat ul-abror — kirish", title_ru: "Хайрат ул-аброр — введение" },
  { id: "a2", title_uz: "Farhod va Shirin — 1-bob", title_ru: "Фархад и Ширин — глава 1" },
  { id: "a3", title_uz: "Layli va Majnun — sevgi", title_ru: "Лейли и Меджнун — любовь" },
];

function MultimediaPage() {
  const { lang } = useLang();
  const t = useT();
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="ornament-divider mb-4 max-w-[120px] mx-auto" />
        <h1 className="font-display text-4xl font-bold text-primary">{t("multimedia")}</h1>
        <p className="text-muted-foreground mt-2">{lang === "uz" ? "Video va audio kontent" : "Видео и аудио контент"}</p>
      </div>

      <section className="mb-12">
        <h2 className="font-display text-2xl text-primary flex items-center gap-2 mb-4">
          <Youtube className="text-gold" /> {t("videos")}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="rounded-2xl bg-card border border-border overflow-hidden shadow-page">
              <div className="aspect-video bg-gradient-to-br from-primary to-primary/70 grid place-items-center relative">
                <PlayCircle className="size-20 text-gold opacity-90" />
                <span className="absolute bottom-3 right-3 text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground">
                  {t("comingSoon")}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-primary">
                  {lang === "uz" ? v.title_uz : v.title_ru}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-primary flex items-center gap-2 mb-4">
          <Headphones className="text-gold" /> {t("audios")}
        </h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">{t("audioComing")}</p>
        <div className="space-y-3">
          {audios.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-gold/50 transition-colors">
              <button className="size-12 rounded-full gradient-gold grid place-items-center shadow-gold shrink-0">
                <PlayCircle className="size-6 text-primary" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-primary truncate">{lang === "uz" ? a.title_uz : a.title_ru}</div>
                <div className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-0 gradient-gold" />
                </div>
              </div>
              <Music className="size-5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground hidden sm:inline">{t("comingSoon")}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
