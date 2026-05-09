import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiBook } from "../../../@types/bible";
import { useTranslation } from "react-i18next";

const fetchBooks = async (translation: string): Promise<ApiBook[]> => {
  const { data } = await axios.get(`https://bible.helloao.org/api/${translation}/books.json`);
  
  return data.books.map((b: any) => ({
    abbrev: b.id,
    author: "Desconhecido",
    chapters: b.numberOfChapters,
    group: b.order <= 39 ? "Antigo Testamento" : "Novo Testamento",
    name: b.name,
    testament: b.order <= 39 ? "VT" : "NT",
  }));
};

export const useBibleBooks = () => {
  const { i18n } = useTranslation();
  const translation = i18n.language.startsWith("pt") ? "por_onbv" : "eng_web";
  
  return useQuery({
    queryKey: ["common-bible-books-helloao", translation],
    queryFn: () => fetchBooks(translation),
    staleTime: Infinity,
  });
};
