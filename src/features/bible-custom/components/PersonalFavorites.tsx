import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { Trash2, Quote, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../store/use-modal-store";
import { useTranslation } from "react-i18next";

export const PersonalFavorites = () => {
  const getAllSavedVerses = useCustomCanonStore((state) => state.getAllSavedVerses);
  const deleteVerse = useCustomCanonStore((state) => state.deleteVerse);
  const { openEditBook } = useModalStore();
  const { t } = useTranslation();
  
  const favoriteVerses = getAllSavedVerses();

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AnimatePresence mode="popLayout">
        {favoriteVerses.map((v) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            key={v.id}
            className="group relative bg-bible-card border border-bible-border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-bible-gold/10 flex items-center justify-center text-bible-gold">
                  <Quote size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="font-cinzel text-[10px] text-bible-gold tracking-widest uppercase">
                    {v.bookTitle}
                  </span>
                  <span className="font-serif text-[10px] text-bible-muted">
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
                    if (typeof item === "object" && item?.noteId) {
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
  );
};
