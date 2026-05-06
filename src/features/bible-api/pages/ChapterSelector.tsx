import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBibleBooks } from "../api/use-bible-books";
import { ChevronLeft, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ChapterSelector() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: books, isLoading } = useBibleBooks();

  const book = books?.find((b) => b.abbrev === bookId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-bible-gold/20 border-t-bible-gold rounded-full animate-spin" />
        <p className="font-cinzel text-xs text-bible-gold animate-pulse tracking-widest uppercase">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20 px-6">
        <p className="text-bible-muted font-serif text-lg mb-8">
          {t("common.no_results")}
        </p>
        <button
          onClick={() => navigate("/default-bible")}
          className="bg-bible-gold text-white px-8 py-3 rounded-xl font-cinzel text-xs uppercase tracking-widest"
        >
          {t("common.back")}
        </button>
      </div>
    );
  }

  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/default-bible")}
        className="flex items-center gap-2 text-bible-muted hover:text-bible-gold transition-colors mb-12 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-cinzel text-xs uppercase tracking-[0.2em]">
          {t("common.back")}
        </span >
      </motion.button>

      <header className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-bible-gold/10 border border-bible-gold/20 text-bible-gold mb-6"
        >
          <BookOpen size={14} />
          <span className="font-cinzel text-[10px] uppercase tracking-widest">
            {book.abbrev}
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-5xl font-bold text-bible-parchment mb-4"
        >
          {book.name}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.2 }}
          className="font-cinzel text-xs uppercase tracking-[0.3em] text-bible-muted"
        >
          {book.chapters} {t("common.chapters")}
        </motion.p>
      </header>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {chapters.map((chapter, index) => (
          <motion.button
            key={chapter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            onClick={() => navigate(`/read/${book.abbrev}/${chapter}`)}
            className="aspect-square flex items-center justify-center rounded-xl bg-bible-card/40 border border-bible-gold/10 text-bible-parchment font-serif text-xl hover:bg-bible-gold hover:text-white hover:border-bible-gold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-300 group"
          >
            <span className="group-hover:scale-110 transition-transform">
              {chapter}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
