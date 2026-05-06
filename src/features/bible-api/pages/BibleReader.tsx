import { useParams, useNavigate } from "react-router-dom";
import { useBibleChapter } from "../api/use-bible-chapter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Type,
  Share2,
  Bookmark,
} from "lucide-react";
import { useAppStore } from "../../../store/use-app-store";
import { useBibleStore } from "../../../store/use-bible-store";

export default function BibleReader() {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>();
  const navigate = useNavigate();

  const { addFavoriteVerse, removeFavoriteVerse, favoriteVerses } =
    useBibleStore();

  const chapterNumber = parseInt(chapter || "1", 10);
  const translation = "por_onbv";

  const { data, isLoading, isError } = useBibleChapter(
    translation,
    bookId || "",
    chapterNumber,
  );

  const fontSize = useAppStore((state) => state.fontSize);
  const setFontSize = useAppStore((state) => state.setFontSize);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-48 space-y-6">
        <div className="w-16 h-16 border-4 border-bible-gold/20 border-t-bible-gold rounded-full animate-spin" />
        <p className="font-cinzel text-sm text-bible-gold animate-pulse tracking-[0.3em] uppercase">
          Abrindo Manuscritos...
        </p>
      </div>
    );

  if (isError || !data)
    return (
      <div className="flex flex-col items-center justify-center py-48 space-y-6 text-center">
        <p className="text-red-500 font-serif text-xl italic">
          Os manuscritos deste capítulo parecem inacessíveis.
        </p>
        <button
          onClick={() => navigate("/common")}
          className="px-8 py-3 rounded-2xl bg-bible-gold text-white font-cinzel text-xs uppercase tracking-widest shadow-xl"
        >
          Retornar ao Cânone
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Immersive Header */}
      <header className="relative mb-16 p-8 md:p-12 rounded-[3rem] bg-bible-card/40 backdrop-blur-xl border border-bible-border shadow-2xl overflow-hidden text-center">
        <button
          onClick={() => navigate("/default-bible")}
          className="absolute top-8 left-8 p-2 text-bible-muted hover:text-bible-gold transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="space-y-2">
          <span className="font-cinzel text-xs text-bible-gold tracking-[0.4em] uppercase opacity-60">
            {data.book.name}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-bible-text">
            {data.chapter.number}
          </h1>
        </div>

        {/* Font Controls */}
        <div className="absolute top-8 right-8 flex items-center gap-4 bg-bible-card/60 p-2 px-4 rounded-2xl border border-bible-border">
          <button
            onClick={() => setFontSize(fontSize - 2)}
            className="text-bible-muted hover:text-bible-gold transition-colors"
          >
            <Type size={14} />
          </button>
          <span className="font-cinzel text-[10px] text-bible-gold w-8">
            {fontSize}px
          </span>
          <button
            onClick={() => setFontSize(fontSize + 2)}
            className="text-bible-muted hover:text-bible-gold transition-colors"
          >
            <Type size={18} />
          </button>
        </div>
      </header>

      {/* Main Scripture Text */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-8 font-serif leading-[1.8] text-bible-text mb-24"
        style={{ fontSize: `${fontSize}px` }}
      >
        {data.chapter.content.map((verse, idx) => {
          const isFavorited = favoriteVerses.some(
            (v) =>
              v.bookAbbrev === bookId &&
              v.chapter === chapterNumber &&
              v.verse === verse.number,
          );

          return (
            <p key={idx} className="relative pl-12 group">
              <span className="absolute left-0 top-1 text-[10px] font-cinzel text-bible-gold opacity-40 group-hover:opacity-100 transition-opacity">
                {String(verse.number).padStart(2, "0")}
              </span>

              <button
                onClick={() => {
                  if (isFavorited) {
                    const fav = favoriteVerses.find(
                      (v) =>
                        v.bookAbbrev === bookId &&
                        v.chapter === chapterNumber &&
                        v.verse === verse.number,
                    );
                    if (fav) removeFavoriteVerse(fav.id);
                  } else {
                    addFavoriteVerse({
                      bookName: data.book.name,
                      bookAbbrev: bookId || "",
                      chapter: chapterNumber,
                      verse: verse.number,
                      text: verse.content.join(" "),
                    });
                  }
                }}
                className={`absolute -left-6 top-1 p-1 rounded-md transition-all opacity-0 group-hover:opacity-100 
                  ${isFavorited ? "text-bible-gold bg-bible-gold/10" : "text-bible-muted hover:text-bible-gold hover:bg-bible-gold/5"}`}
              >
                <Bookmark
                  size={12}
                  fill={isFavorited ? "currentColor" : "none"}
                />
              </button>

              <span className="selection:bg-bible-gold/30">
                {verse.content.join(" ")}
              </span>
            </p>
          );
        })}
      </motion.article>

      {/* Navigation & Actions */}
      <footer className="flex flex-col gap-12 items-center mb-32">
        <div className="flex items-center gap-6">
          {data.previousChapterApiLink && (
            <button
              onClick={() => navigate(`/read/${bookId}/${chapterNumber - 1}`)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-bible-card border border-bible-border text-bible-gold hover:bg-bible-gold hover:text-white transition-all shadow-lg shadow-black/10"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div className="flex gap-4">
            <button
              onClick={() =>
                alert(`Marcador salvo no capítulo ${data.chapter.number}`)
              }
              className="p-4 rounded-2xl bg-bible-card border border-bible-border text-bible-muted hover:text-bible-gold transition-all shadow-lg shadow-black/5"
            >
              <Bookmark size={20} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Holy Bible - ${data.book.name} ${data.chapter.number}`,
                    url: window.location.href,
                  });
                } else {
                  alert("Link copiado para a área de transferência!");
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-4 rounded-2xl bg-bible-card border border-bible-border text-bible-muted hover:text-bible-gold transition-all shadow-lg shadow-black/5"
            >
              <Share2 size={20} />
            </button>
          </div>

          {data.nextChapterApiLink && (
            <button
              onClick={() => navigate(`/read/${bookId}/${chapterNumber + 1}`)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-bible-card border border-bible-border text-bible-gold hover:bg-bible-gold hover:text-white transition-all shadow-lg shadow-black/10"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        <p className="font-cinzel text-[10px] text-bible-muted uppercase tracking-[0.5em] opacity-30">
          Amen
        </p>
      </footer>
    </div>
  );
}
