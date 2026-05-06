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
        search_placeholder: "Search books or phases...",
        none: "Acquired",
        missing: "Missing",
        acquired: "Purchased",
        downloaded: "Downloaded",
        manuscript: "Manuscript",
        sacred_verses: "Sacred Verses",
        tags: "Tags & Collections",
        no_favorites_yet: "You haven't saved any favorite verses yet.",
        go_to_chapter: "Go to Chapter",
        canon: "Library",
        favorites: "Verses",
        books: "Books",
        old_testament: "Old Testament",
        new_testament: "New Testament",
        chapters: "Chapters",
        read: "Read",
        loading: "Loading Scriptures...",
        error_loading: "Error loading the bible. Please check your connection.",
        back_to_canon: "Return to Canon",
        next: "Next",
        previous: "Previous",
        chapter: "Chapter",
        footer: "In Principio Erat Verbum",
        book_num: "Book {{num}}",
      },
      onboarding: {
        title: "Your Sacred Journey",
        subtitle: "Choose how you want to organize your library",
        personal_title: "My Own Journey",
        personal_desc:
          "Create everything from scratch. Add your own books, phases, and themes.",
        suggestion_title: "Guided Suggestion",
        suggestion_desc:
          "Start with our curated canon of 250+ books across 19 historical phases.",
        conventional_title: "Conventional Canon",
        conventional_desc:
          "Access the traditional Bible with the standard 66 books and study tools.",
        start: "Start Journey",
      },
      modal: {
        add_books: "Add Books",
        book_name: "Book Name",
        book_sub: "Subtitle (Optional)",
        finish: "Finish Phase",
        add_another: "Add Another Book",
        new_manuscript: "New Manuscript",
        new_journey: "New Journey",
        step_phase: "Phase Details",
        step_books: "Initial Books",
        phase_title: "Phase Title",
        phase_placeholder: "Enter phase title (e.g., Old Testament)",
        choose_theme: "Choose Visual Theme",
        add: "Add",
        no_books_added: "No books added yet.",
        create_phase: "Create Phase with {{count}} books",
        creating: "Creating...",
        suggested_tags: "Suggested Tags",
        new_tag: "New tag...",
        optional: "Optional",
        delete_confirm: "Are you sure you want to delete this book?",
        delete_warning:
          'This will permanently remove "{{name}}" and all its {{count}} verses.',
        status_acquisition: "Acquisition Status",
        reference: "Reference",
        content: "Content",
        verse_placeholder: "Enter the sacred words...",
      },
      stats: {
        progress: "Sacred Canon",
        completed: "of the journey completed",
        books_count: "{{read}} of {{total}} Books",
        books_in_journey: "{{count}} Books in the Journey",
      },
      empty: {
        journey_not_started: "Your journey hasn't started yet.",
        create_first_phase:
          "Create your first phase and start organizing your library.",
        no_saved_verses: "Your sacred verse collection is empty.",
        add_verses_by_editing: "Add verses by editing your books.",
        phase_empty: "Your library is empty in this phase. Start adding books!",
      },
      confirm: {
        delete_phase: "Delete Phase?",
        delete_phase_warning:
          'This will permanently remove "{{title}}" and all its books.',
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
        search_placeholder: "Pesquisar livros ou fases...",
        none: "Tenho",
        missing: "Faltando",
        acquired: "Comprado",
        downloaded: "Baixado",
        manuscript: "Manuscrito",
        sacred_verses: "Versículos Sagrados",
        tags: "Tags & Coleções",
        no_favorites_yet: "Você ainda não salvou nenhum versículo favorito.",
        go_to_chapter: "Ir para o Capítulo",
        canon: "Biblioteca",
        favorites: "Versículos",
        books: "Livros",
        old_testament: "Antigo Testamento",
        new_testament: "Novo Testamento",
        chapters: "Capítulos",
        read: "Ler",
        loading: "Carregando Escrituras...",
        error_loading: "Erro ao carregar a bíblia. Verifique sua conexão.",
        back_to_canon: "Retornar ao Cânone",
        next: "Próximo",
        previous: "Anterior",
        chapter: "Capítulo",
        footer: "In Principio Erat Verbum",
        book_num: "Livro {{num}}",
      },
      onboarding: {
        title: "Sua Jornada Sagrada",
        subtitle: "Escolha como deseja organizar sua biblioteca",
        personal_title: "Minha Própria Jornada",
        personal_desc:
          "Crie tudo do zero. Adicione seus próprios livros, fases e temas.",
        suggestion_title: "Sugestão Guiada",
        suggestion_desc:
          "Comece com nosso cânone curado de 250+ livros em 19 fases históricas.",
        conventional_title: "Cânone Convencional",
        conventional_desc:
          "Acesse a Bíblia tradicional com os 66 livros padrões e ferramentas de estudo.",
        start: "Iniciar Jornada",
      },
      modal: {
        add_books: "Adicionar Livros",
        book_name: "Nome do Livro",
        book_sub: "Subtítulo (Opcional)",
        finish: "Finalizar Fase",
        add_another: "Adicionar outro livro",
        new_manuscript: "Novo Manuscrito",
        new_journey: "Nova Jornada",
        step_phase: "Detalhes da Fase",
        step_books: "Livros Iniciais",
        phase_title: "Título da Fase",
        phase_placeholder: "Ex: Antigo Testamento",
        choose_theme: "Escolha o Tema Visual",
        add: "Adicionar",
        no_books_added: "Nenhum livro adicionado ainda.",
        create_phase: "Criar Fase com {{count}} livros",
        creating: "Criando...",
        suggested_tags: "Tags Sugeridas",
        new_tag: "Nova tag...",
        optional: "Opcional",
        delete_confirm: "Deseja excluir este livro?",
        delete_warning:
          'Isso removerá permanentemente "{{name}}" e todos os seus {{count}} versículos.',
        status_acquisition: "Status de Aquisição",
        reference: "Referência",
        content: "Conteúdo",
        verse_placeholder: "Digite as palavras sagradas...",
      },
      stats: {
        progress: "Cânone Sagrado",
        completed: "da jornada concluída",
        books_count: "{{read}} de {{total}} Livros",
        books_in_journey: "{{count}} Livros na Jornada",
      },
      empty: {
        journey_not_started: "Sua jornada ainda não começou.",
        create_first_phase:
          "Crie sua primeira fase e comece a organizar sua biblioteca.",
        no_saved_verses: "Sua coleção de versículos está vazia.",
        add_verses_by_editing: "Adicione versículos editando seus livros.",
        phase_empty:
          "Sua biblioteca está vazia nesta fase. Comece a adicionar livros!",
      },
      confirm: {
        delete_phase: "Excluir Fase?",
        delete_phase_warning:
          'Isso removerá permanentemente "{{title}}" e todos os seus livros.',
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
    },
  });

export default i18n;
