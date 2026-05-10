import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "uz" | "ru";

type Dict = Record<string, { uz: string; ru: string }>;

export const t: Dict = {
  appName: { uz: "Alisher Navoiy Merosi", ru: "Наследие Алишера Навои" },
  tagline: {
    uz: "Sun'iy intellekt asosidagi kutubxona va o'quv platformasi",
    ru: "Библиотека и обучающая платформа на базе ИИ",
  },
  home: { uz: "Bosh sahifa", ru: "Главная" },
  library: { uz: "Kutubxona", ru: "Библиотека" },
  tutor: { uz: "AI Murabbiy", ru: "AI Наставник" },
  quiz: { uz: "Adaptiv test", ru: "Адаптивный тест" },
  multimedia: { uz: "Multimedia", ru: "Мультимедиа" },
  progress: { uz: "Yutuqlar", ru: "Прогресс" },
  startReading: { uz: "O'qishni boshlash", ru: "Начать чтение" },
  exploreLibrary: { uz: "Kutubxonani ochish", ru: "Открыть библиотеку" },
  askAi: { uz: "AI murabbiyga savol berish", ru: "Спросить AI наставника" },
  read: { uz: "O'qish", ru: "Читать" },
  book: { uz: "Kitob", ru: "Книга" },
  page: { uz: "Sahifa", ru: "Страница" },
  prev: { uz: "Oldingi", ru: "Назад" },
  next: { uz: "Keyingi", ru: "Далее" },
  back: { uz: "Orqaga", ru: "Назад" },
  startQuiz: { uz: "Testni boshlash", ru: "Начать тест" },
  question: { uz: "Savol", ru: "Вопрос" },
  difficulty: { uz: "Daraja", ru: "Уровень" },
  easy: { uz: "Oson", ru: "Лёгкий" },
  medium: { uz: "O'rta", ru: "Средний" },
  hard: { uz: "Qiyin", ru: "Сложный" },
  correct: { uz: "To'g'ri!", ru: "Верно!" },
  incorrect: { uz: "Noto'g'ri", ru: "Неверно" },
  explanation: { uz: "Izoh", ru: "Объяснение" },
  nextQuestion: { uz: "Keyingi savol", ru: "Следующий вопрос" },
  finish: { uz: "Yakunlash", ru: "Завершить" },
  result: { uz: "Natija", ru: "Результат" },
  generating: { uz: "Savollar tayyorlanmoqda...", ru: "Готовим вопросы..." },
  thinking: { uz: "O'ylanmoqda...", ru: "Размышляю..." },
  send: { uz: "Yuborish", ru: "Отправить" },
  askPlaceholder: {
    uz: "Navoiy ijodi haqida so'rang...",
    ru: "Спросите о творчестве Навои...",
  },
  videos: { uz: "Video galereya", ru: "Видеогалерея" },
  audios: { uz: "Audiokitoblar", ru: "Аудиокниги" },
  comingSoon: { uz: "Tez orada", ru: "Скоро" },
  heroBadge: { uz: "1441 — 1501", ru: "1441 — 1501" },
  heroTitle: {
    uz: "Alisher Navoiy",
    ru: "Алишер Навои",
  },
  heroTagline: {
    uz: "Ma'rifat va tafakkur timsoli.",
    ru: "Символ просвещения и мысли.",
  },
  heroSubtitle: {
    uz: "Asrlardan oshib kelayotgan hikmat va ma'naviyat manbai. Asarlar, AI yordamchi va interaktiv testlar bilan bilim oling.",
    ru: "Источник мудрости и духовности, передаваемый через века. Получайте знания через произведения, AI-помощника и интерактивные тесты.",
  },
  worksCount: { uz: "12 asar", ru: "12 произведений" },
  aiTutorTitle: { uz: "AI Murabbiy bilan suhbat", ru: "Беседа с AI Наставником" },
  aiTutorSub: {
    uz: "Navoiy falsafasi, she'riyati va tarixi bo'yicha har qanday savolingizga javob.",
    ru: "Ответы на любые вопросы о философии, поэзии и истории Навои.",
  },
  quizTitle: { uz: "Aqlli adaptiv test", ru: "Умный адаптивный тест" },
  quizSub: {
    uz: "Bilim darajangizga moslashadigan AI savollar.",
    ru: "AI-вопросы, адаптирующиеся под ваш уровень.",
  },
  selectBook: { uz: "Kitobni tanlang", ru: "Выберите книгу" },
  totalScore: { uz: "Umumiy natija", ru: "Общий результат" },
  retry: { uz: "Qayta urinish", ru: "Повторить" },
  audioComing: {
    uz: "Bu yerda professional aktyorlar tomonidan o'qilgan audiokitoblar joylashtiriladi.",
    ru: "Здесь будут размещены аудиокниги в исполнении профессиональных актёров.",
  },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "uz",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("navoiy-lang")) as Lang | null;
    if (saved === "uz" || saved === "ru") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("navoiy-lang", l);
  };
  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
export const useT = () => {
  const { lang } = useLang();
  return (key: keyof typeof t) => t[key][lang];
};
