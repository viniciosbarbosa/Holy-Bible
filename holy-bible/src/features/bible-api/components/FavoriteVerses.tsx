import { useBibleStore } from "../../../store/use-bible-store";
import { Trash2, Quote, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const FavoriteVerses = () => {
  const { favoriteVerses, removeFavoriteVerse } = useBibleStore();
  const navigate = useNavigate();

  if (favoriteVerses.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-bible-border rounded-[2.5rem] bg-bible-card/30">
        <Quote size={40} className="mx-auto text-bible-gold/20 mb-4" />
        <p className="text-bible-muted font-serif italic">
          Você ainda não salvou nenhum versículo favorito.
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
            className="group relative bg-white dark:bg-bible-card border border-bible-border rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-bible-gold/10 flex items-center justify-center text-bible-gold">
                  <Quote size={14} />
                </div>
                <span className="font-cinzel text-xs text-bible-gold tracking-widest">
                  {v.bookName} {v.chapter}:{v.verse}
                </span>
              </div>
              <button 
                onClick={() => removeFavoriteVerse(v.id)}
                className="p-2 text-bible-muted hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <p className="font-serif text-lg text-bible-text leading-relaxed mb-6 italic">
              "{v.text}"
            </p>

            <button 
              onClick={() => navigate(`/read/${v.bookAbbrev}/${v.chapter}`)}
              className="flex items-center gap-2 font-cinzel text-[10px] uppercase tracking-[0.2em] text-bible-gold hover:text-bible-gold-light transition-colors"
            >
              Ir para o Capítulo <ArrowRight size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
