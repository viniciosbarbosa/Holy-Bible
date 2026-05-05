import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiBook } from "../../../@types/bible";

const fetchBooks = async (): Promise<ApiBook[]> => {
  const { data } = await axios.get("https://bible.helloao.org/api/por_onbv/books.json");
  
  return data.books.map((b: any) => ({
    abbrev: b.id,
    author: "Desconhecido", // HelloAO não fornece autor
    chapters: b.numberOfChapters,
    group: b.order <= 39 ? "Antigo Testamento" : "Novo Testamento",
    name: b.name,
    testament: b.order <= 39 ? "VT" : "NT",
  }));
};

export const useBibleBooks = () => {
  return useQuery({
    queryKey: ["common-bible-books-helloao"],
    queryFn: fetchBooks,
    staleTime: Infinity,
  });
};
