import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        my_bible: "Personal",
        default_bible: "Conventional",
      },
      common: {
        add_phase: "Add Phase",
        add_book: "Add Book",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        save: "Save",
        confirm: "Confirm",
      },
      stats: {
        progress: "Sacred Canon",
        completed: "of the journey completed",
        books_count: "{{read}} of {{total}} Books",
      },
    },
  },
  pt: {
    translation: {
      nav: {
        my_bible: "Minha",
        default_bible: "Bíblia",
      },
      common: {
        add_phase: "Nova Fase",
        add_book: "Novo Livro",
        edit: "Editar",
        delete: "Excluir",
        cancel: "Cancelar",
        save: "Salvar",
        confirm: "Confirmar",
      },
      stats: {
        progress: "Cânone Sagrado",
        completed: "da jornada concluída",
        books_count: "{{read}} de {{total}} Livros",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
