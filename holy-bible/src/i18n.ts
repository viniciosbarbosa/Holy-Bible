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
      },
      onboarding: {
        title: "Your Sacred Journey",
        subtitle: "Choose how you want to organize your library",
        personal_title: "My Own Journey",
        personal_desc: "Create everything from scratch. Add your own books, phases, and themes.",
        suggestion_title: "Guided Suggestion",
        suggestion_desc: "Start with our curated canon of 250+ books across 19 historical phases.",
        start: "Begin Journey"
      },
      modal: {
        add_books: "Add Books",
        book_name: "Book Name",
        book_sub: "Subtitle (Optional)",
        finish: "Finish Phase",
        add_another: "Add Another Book"
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
        my_bible: "Personal",
        default_bible: "Bíblia",
      },
      common: {
        add_phase: "Nova Fase",
        cancel: "Cancelar",
        save: "Salvar",
        delete: "Excluir",
        edit: "Editar",
      },
      onboarding: {
        title: "Sua Jornada Sagrada",
        subtitle: "Escolha como deseja organizar sua biblioteca",
        personal_title: "Minha Própria Jornada",
        personal_desc: "Crie tudo do zero. Adicione seus próprios livros, fases e temas.",
        suggestion_title: "Sugestão Guiada",
        suggestion_desc: "Comece com nosso cânone curado de 250+ livros em 19 fases históricas.",
        start: "Iniciar Jornada"
      },
      modal: {
        add_books: "Adicionar Livros",
        book_name: "Nome do Livro",
        book_sub: "Subtítulo (Opcional)",
        finish: "Finalizar Fase",
        add_another: "Adicionar outro livro"
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
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    }
  });

export default i18n;
