import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Verse {
  type: string;
  number: number;
  content: string[];
}

export interface ChapterData {
  translation: any;
  book: {
    id: string;
    name: string;
    numberOfChapters: number;
  };
  chapter: {
    number: number;
    content: Verse[];
  };
  previousChapterApiLink: string | null;
  nextChapterApiLink: string | null;
}

const fetchChapter = async (translation: string, bookId: string, chapter: number): Promise<ChapterData> => {
  const { data } = await axios.get(`https://bible.helloao.org/api/${translation}/${bookId}/${chapter}.json`);
  return data;
};

export const useBibleChapter = (translation: string, bookId: string, chapter: number) => {
  return useQuery({
    queryKey: ["bible-chapter", translation, bookId, chapter],
    queryFn: () => fetchChapter(translation, bookId, chapter),
    staleTime: Infinity, // The text of the bible doesn't change
    enabled: !!bookId && !!chapter,
  });
};
