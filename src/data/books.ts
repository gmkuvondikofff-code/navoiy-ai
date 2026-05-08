import data from "./books.json";

export type Book = {
  id: string;
  order: number;
  category: "biography" | "study" | "lyric" | "tradition" | "epic" | "scholar" | "sufi";
  titleUz: string;
  titleRu: string;
  subtitleUz: string;
  subtitleRu: string;
  paragraphs: string[];
};

export const books: Book[] = data as Book[];

export const getBook = (id: string) => books.find((b) => b.id === id);
