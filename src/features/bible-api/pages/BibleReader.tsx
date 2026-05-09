import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBibleChapter } from "../api/use-bible-chapter";
import { useBibleBooks } from "../api/use-bible-books";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Type,
  Bookmark,
  Share2,
} from "lucide-react";
import { useAppStore } from "../../../store/use-app-store";
import { useBibleStore } from "../../../store/use-bible-store";

export default function BibleReader() {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { addFavoriteVerse, removeFavoriteVerse, favoriteVerses } =
    useBibleStore();
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const chapterNumber = parseInt(chapter || "1", 10);
  const { i18n } = useTranslation();
  const translation = i18n.language.startsWith("pt") ? "por_onbv" : "eng_web";

  const { data, isLoading, isError } = useBibleChapter(
    translation,
    bookId || "",
    chapterNumber,
  );

  const { data: books } = useBibleBooks();

  const fontSize = useAppStore((state) => state.fontSize);
  const setFontSize = useAppStore((state) => state.setFontSize);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-bible-gold/20 border-t-bible-gold rounded-full animate-spin" />
        <p className="font-cinzel text-xs text-bible-gold animate-pulse tracking-widest uppercase">
          {t("common.loading")}
        </p>
      </div>
    );

  if (isError || !data)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center px-6">
        <p className="text-red-500 font-serif text-xl italic">
          {t("common.error_loading")}
        </p>
        <button
          onClick={() => navigate("/default-bible")}
          className="px-8 py-3 rounded-2xl bg-bible-gold text-white font-cinzel text-xs uppercase tracking-widest shadow-xl"
        >
          {t("common.back_to_canon")}
        </button>
      </div>
    );

  const handlePrevious = () => {
    if (chapterNumber > 1) {
      navigate(`/read/${bookId}/${chapterNumber - 1}`);
    } else if (books) {
      const currentIndex = books.findIndex((b) => b.abbrev === bookId);
      if (currentIndex > 0) {
        const prevBook = books[currentIndex - 1];
        navigate(`/read/${prevBook.abbrev}/${prevBook.chapters}`);
      }
    }
  };

  const handleNext = () => {
    if (data && chapterNumber < data.book.numberOfChapters) {
      navigate(`/read/${bookId}/${chapterNumber + 1}`);
    } else if (books) {
      const currentIndex = books.findIndex((b) => b.abbrev === bookId);
      if (currentIndex < books.length - 1) {
        const nextBook = books[currentIndex + 1];
        navigate(`/read/${nextBook.abbrev}/1`);
      }
    }
  };

  const hasPrevious =
    chapterNumber > 1 ||
    (books?.findIndex((b) => b.abbrev === bookId) ?? -1) > 0;
  const hasNext =
    (data && chapterNumber < data.book.numberOfChapters) ||
    (books && books.findIndex((b) => b.abbrev === bookId) < books.length - 1);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-32">
      <AnimatePresence>
        {showSavedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-bible-gold text-white px-6 py-3 rounded-full font-cinzel text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2"
          >
            <Bookmark size={14} fill="white" />
            {t("common.verse_saved")}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Header */}
      <header className="relative mb-12 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-bible-card/80 backdrop-blur-2xl border border-bible-border shadow-2xl overflow-hidden text-center">
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <button
          onClick={() => navigate("/default-bible")}
          className="absolute top-6 left-6 md:top-8 md:left-8 p-3 text-bible-muted hover:text-bible-gold bg-bible-gold/5 rounded-xl border border-bible-gold/10 transition-all"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="space-y-2 mt-4 md:mt-0">
          <span className="font-cinzel text-[10px] md:text-xs text-bible-gold tracking-[0.4em] uppercase opacity-60">
            {data.book.name}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-bible-text leading-tight">
            {data.chapter.number}
          </h1>
        </div>

        {/* Font Controls */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-3 bg-bible-card/80 backdrop-blur-md p-1.5 md:p-2 px-3 rounded-xl border border-bible-border z-20">
          <button
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            className="p-1.5 text-bible-muted hover:text-bible-gold transition-colors"
          >
            <Type size={14} />
          </button>
          <div className="w-px h-3 bg-bible-border/30" />
          <button
            onClick={() => setFontSize(Math.min(32, fontSize + 2))}
            className="p-1.5 text-bible-muted hover:text-bible-gold transition-colors"
          >
            <Type size={18} />
          </button>
        </div>
      </header>

      {/* Main Scripture Text */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-bible-card/60 backdrop-blur-2xl border border-bible-border rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-inner overflow-hidden mb-16"
      >
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        {/* Parchment effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/papyros.png')]" />

        <div
          className="relative z-10 space-y-8 font-serif leading-[1.8] text-bible-text"
          style={{ fontSize: `${fontSize}px` }}
        >
          {data.chapter.content.map((verse, idx) => {
            const isFavorited = favoriteVerses.some(
              (v) =>
                v.bookAbbrev === bookId &&
                v.chapter === String(chapterNumber) &&
                v.verse === String(verse.number),
            );

            return (
              <div
                key={idx}
                className="group relative pl-10 md:pl-14 transition-all hover:bg-bible-gold/5 -mx-4 px-10 py-2 rounded-xl"
              >
                <span className="absolute left-2 md:left-4 top-3 text-[10px] md:text-xs font-cinzel text-bible-gold/30 group-hover:text-bible-gold/60 transition-colors">
                  {verse.number}
                </span>

                <button
                  onClick={() => {
                    if (isFavorited) {
                      const fav = favoriteVerses.find(
                        (v) =>
                          v.bookAbbrev === bookId &&
                          v.chapter === String(chapterNumber) &&
                          v.verse === String(verse.number),
                      );
                      if (fav) removeFavoriteVerse(fav.id);
                    } else {
                      addFavoriteVerse({
                        bookName: data.book.name,
                        bookAbbrev: bookId || "",
                        chapter: String(chapterNumber),
                        verse: String(verse.number),
                        text: verse.content,
                      });
                      setShowSavedFeedback(true);
                      setTimeout(() => setShowSavedFeedback(false), 2000);
                    }
                  }}
                  className={`absolute right-2 top-3 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 
                    ${isFavorited ? "text-bible-gold bg-bible-gold/10 opacity-100" : "text-bible-muted hover:text-bible-gold hover:bg-bible-gold/5"}`}
                >
                  <Bookmark
                    size={14}
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                </button>

                <p className="selection:bg-bible-gold/30">
                  {verse.content.map((item, i) => {
                    if (typeof item === "string") return item;
                    if (typeof item === "object" && item !== null) {
                      return (
                        <sup key={i} className="text-[10px] text-bible-gold mx-0.5 opacity-60 font-cinzel">
                          {item.noteId}
                        </sup>
                      );
                    }
                    return null;
                  })}
                </p>
              </div>
            );
          })}
        </div>
      </motion.article>

      {/* Navigation */}
      <div className="grid grid-cols-3 items-center gap-4 px-2 md:px-4">
        <button
          disabled={!hasPrevious}
          onClick={handlePrevious}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl border border-bible-border text-bible-muted hover:text-bible-gold hover:border-bible-gold/30 transition-all font-cinzel text-[10px] md:text-xs uppercase tracking-widest disabled:opacity-20 bg-bible-card/40 backdrop-blur-md"
        >
          <ChevronLeft size={16} /> <span className="hidden md:inline">{t("common.previous")}</span>
        </button>

        <div className="flex justify-center">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Holy Bible - ${data.book.name} ${data.chapter.number}`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-bible-card/60 backdrop-blur-md border border-bible-border text-bible-muted hover:text-bible-gold transition-all"
          >
            <Share2 size={20} />
          </button>
        </div>

        <button
          disabled={!hasNext}
          onClick={handleNext}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-bible-gold text-white shadow-xl shadow-bible-gold/20 hover:scale-[1.02] active:scale-95 transition-all font-cinzel text-[10px] md:text-xs uppercase tracking-widest disabled:opacity-20"
        >
          <span className="hidden md:inline">{t("common.next")}</span> <ChevronRight size={16} />
        </button>
      </div>

      <footer className="mt-20 text-center opacity-20">
        <p className="font-cinzel text-[10px] uppercase tracking-[0.5em] text-bible-gold">
          {t("common.footer")}
        </p>
      </footer>
    </div>
  );
}
