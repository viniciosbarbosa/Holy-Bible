import { useState } from "react";
import { motion } from "framer-motion";
import { useBibleBooks } from "../api/use-bible-books";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bookmark } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FavoriteVerses } from "../components/FavoriteVerses";
import { normalizeString } from "../../../lib/utils";

export default function CommonBible() {
  const { data: books, isLoading, error } = useBibleBooks();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"books" | "favorites">("books");
  const [search, setSearch] = useState("");

  const filteredBooks = books?.filter((b) => {
    const s = normalizeString(search);
    return (
      normalizeString(b.name).includes(s) ||
      normalizeString(b.abbrev).includes(s)
    );
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-bible-gold/20 border-t-bible-gold rounded-full animate-spin" />
        <p className="font-cinzel text-xs text-bible-gold animate-pulse tracking-widest">
          {t("common.loading")}
        </p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500 font-serif px-6">
        {t("common.error_loading")}
      </div>
    );

  return (
    <div className="relative">
      <header className="mb-12 text-center">
        <h2 className="font-cinzel text-2xl text-bible-gold tracking-[0.2em] mb-8 uppercase">
          {t("nav.default_bible")}
        </h2>

        {/* Tab Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 px-4">
          <div className="flex bg-bible-card/50 backdrop-blur-xl p-1.5 rounded-2xl border border-bible-gold/20 shadow-inner w-full md:w-auto">
            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-cinzel text-xs uppercase tracking-widest transition-all ${
                activeTab === "books"
                  ? "bg-bible-gold text-white shadow-lg shadow-bible-gold/20"
                  : "text-bible-muted hover:text-bible-gold"
              }`}
            >
              <BookOpen size={16} /> {t("common.books")}
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-cinzel text-xs uppercase tracking-widest transition-all ${
                activeTab === "favorites"
                  ? "bg-bible-gold text-white shadow-lg shadow-bible-gold/20"
                  : "text-bible-muted hover:text-bible-gold"
              }`}
            >
              <Bookmark size={16} /> {t("common.favorites")}
            </button>
          </div>

          {/* Search Bar */}
          {activeTab === "books" && (
            <div className="relative w-full md:w-80 group">
              <input
                type="text"
                data-testid="search-input"
                aria-label="Search books"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("common.search_placeholder")}
                className="w-full bg-bible-card/50 backdrop-blur-xl border border-bible-gold/10 rounded-2xl py-4 px-6 text-bible-text text-sm focus:border-bible-gold outline-none transition-all"
              />
            </div>
          )}
        </div>
      </header>

      {activeTab === "favorites" ? (
        <FavoriteVerses />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {filteredBooks?.map((book, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.4 }}
              key={book.abbrev}
              data-testid="book-card"
              onClick={() => navigate(`/read/${book.abbrev}/1`)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-bible-gold/50 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(201,168,76,0.2)]"
            >
              {/* Efeito de hover */}
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-bible-gold/10 blur-3xl transition-all duration-500 group-hover:bg-bible-gold/30 pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-4 flex items-start justify-between">
                  <span className="font-cinzel text-[9px] bg-bible-gold/10 px-2 py-0.5 rounded-md text-bible-gold uppercase tracking-widest border border-bible-gold/20">
                    {book.abbrev}
                  </span>
                  <span className="font-cinzel text-[10px] uppercase text-bible-muted bg-white/5 px-2 py-1 rounded border border-white/5">
                    {book.testament === "VT" ? t("common.old_testament") : t("common.new_testament")}
                  </span>
                </div>

                <h3 className="mb-2 font-serif text-2xl font-bold text-bible-parchment transition-colors group-hover:text-bible-gold-light">
                  {book.name}
                </h3>

                <div className="flex items-center justify-between mt-6 text-sm text-bible-muted/80 pt-4 border-t border-white/5">
                  <span className="font-cinzel uppercase text-[10px] tracking-widest">
                    {book.chapters} {t("common.chapters")}
                  </span>

                  <span className="flex items-center gap-1.5 text-bible-gold opacity-0 group-hover:opacity-100 transition-opacity font-cinzel text-[10px] tracking-widest uppercase">
                    <BookOpen size={12} /> {t("common.read")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
