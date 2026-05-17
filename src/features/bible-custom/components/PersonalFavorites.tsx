import { useMemo, useState } from "react";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { Trash2, Quote, Edit2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../store/use-modal-store";
import { useTranslation } from "react-i18next";

export const PersonalFavorites = () => {
  const getAllSavedVerses = useCustomCanonStore((state) => state.getAllSavedVerses);
  const deleteVerse = useCustomCanonStore((state) => state.deleteVerse);
  const { openEditBook } = useModalStore();
  const { t } = useTranslation();
  
  const favoriteVerses = getAllSavedVerses();
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>({});

  const toggleBook = (bookTitle: string) => {
    setExpandedBooks((prev) => ({
      ...prev,
      [bookTitle]: !prev[bookTitle],
    }));
  };

  // Group verses by book title for unified sections
  const groupedVerses = useMemo(() => {
    return favoriteVerses.reduce((acc, v) => {
      const key = v.bookTitle; // Group strictly by name
      if (!acc[key]) {
        acc[key] = { 
          title: v.bookTitle, 
          verses: [] 
        };
      }
      acc[key].verses.push(v);
      return acc;
    }, {} as Record<string, { title: string; verses: typeof favoriteVerses }>);
  }, [favoriteVerses]);

  if (favoriteVerses.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-bible-border rounded-[2.5rem] bg-bible-card/30 px-6">
        <Quote size={40} className="mx-auto text-bible-gold/20 mb-4" />
        <p className="text-bible-muted font-serif italic">
          {t("empty.no_saved_verses")} <br />
          <span className="text-xs opacity-60">{t("empty.add_verses_by_editing")}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedVerses).map(([key, group]) => {
        const isExpanded = !!expandedBooks[key];
        return (
          <section
            key={key}
            className="border border-bible-border/30 rounded-[2rem] bg-bible-card/20 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Accordion Header */}
            <div
              onClick={() => toggleBook(key)}
              className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer select-none group/header hover:bg-bible-gold/[0.03] transition-colors duration-300"
            >
              <div className="flex flex-col">
                <h2 className="font-cinzel text-[13px] md:text-sm text-bible-gold tracking-[0.2em] group-hover/header:text-bible-gold-light transition-colors leading-tight uppercase">
                  {group.title}
                </h2>
                <span className="text-[8px] font-cinzel text-bible-muted uppercase tracking-widest opacity-60 mt-1">
                  {group.verses.length} {t("common.sacred_verses")}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="h-px flex-1 bg-gradient-to-r from-bible-gold/5 via-bible-gold/20 to-transparent hidden sm:block" />
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-8 h-8 rounded-full bg-bible-gold/5 flex items-center justify-center border border-bible-gold/10 group-hover/header:bg-bible-gold/20 transition-all shrink-0"
                >
                  <ChevronDown className="text-bible-gold" size={14} />
                </motion.div>
              </div>
            </div>

            {/* Accordion Content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-4 border-t border-bible-border/20 bg-bible-dark/5">
                    <div className="max-h-[400px] md:max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-bible-gold/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                        <AnimatePresence mode="popLayout">
                          {group.verses.map((v) => (
                            <motion.div
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              key={v.id}
                              className="group relative bg-bible-card border border-bible-border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-bible-gold/10 flex items-center justify-center text-bible-gold">
                                    <Quote size={14} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-serif text-[10px] text-bible-gold">
                                      {v.chapter}:{v.verse}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => openEditBook(v.bookId, v.phaseId)}
                                    className="p-2 text-bible-muted hover:text-bible-gold hover:bg-bible-gold/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    title={t("common.edit")}
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteVerse(v.phaseId, v.bookId, v.id)}
                                    className="p-2 text-bible-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <p className="font-serif text-lg text-bible-text leading-relaxed italic">
                                "
                                {Array.isArray(v.text)
                                  ? v.text.map((item, index) => {
                                      if (typeof item === "string") {
                                        return <span key={index}>{item}</span>;
                                      }
                                      if (typeof item === "object" && item?.noteId !== undefined) {
                                        return (
                                          <sup
                                            key={index}
                                            className="text-[10px] text-bible-gold ml-0.5 opacity-60"
                                          >
                                            {item.noteId}
                                          </sup>
                                        );
                                      }
                                      return null;
                                    })
                                  : v.text.replace(/\[object Object\]/g, "")}
                                "
                              </p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}
    </div>
  );
};

