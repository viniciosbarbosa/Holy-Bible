import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../store/use-modal-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { X, Plus, Book as BookIcon, Tags, Hash } from "lucide-react";
import { BUILT_IN_TAGS } from "../constants/tags";

export const AddBookModal = () => {
  const { isAddBookOpen, activePhaseId, closeAllModals } = useModalStore();
  const { addBook, personalPhases, suggestionPhases, activeProfile } = useCustomCanonStore();
  const phases = activeProfile === "suggestion" ? suggestionPhases : personalPhases;
  
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const allExistingTags = useMemo(() => {
    const tagsSet = new Set<string>();
    Object.values(BUILT_IN_TAGS).forEach(t => tagsSet.add(t.lbl));
    phases.forEach(p => p.books.forEach(b => b.tags.forEach(t => tagsSet.add(t))));
    return Array.from(tagsSet).sort();
  }, [phases]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !activePhaseId) return;
    
    addBook(activePhaseId, {
      num: String(Math.floor(Math.random() * 1000)), // Temp ID logic
      name,
      sub,
      tags,
    });
    
    setName("");
    setSub("");
    setTags([]);
    closeAllModals();
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };

  return (
    <AnimatePresence>
      {isAddBookOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAllModals}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-bible-card border border-bible-border rounded-[3rem] p-10 shadow-2xl"
          >
            <button
              onClick={closeAllModals}
              className="absolute top-8 right-8 text-bible-muted hover:text-bible-gold transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-10">
              <div className="w-14 h-14 bg-bible-gold/10 rounded-[1.25rem] flex items-center justify-center text-bible-gold mb-5 border border-bible-gold/20 shadow-lg shadow-bible-gold/5">
                <BookIcon size={28} />
              </div>
              <h2 className="font-cinzel text-2xl text-bible-gold tracking-[0.2em] uppercase">
                Novo Manuscrito
              </h2>
              <p className="text-bible-muted font-serif italic text-sm mt-1 opacity-60">
                Adicione um novo livro à sua jornada sagrada.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Hash size={10} /> Título do Livro
                </label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Apocalipse, Gênesis..."
                  className="w-full bg-bible-dark/50 border border-bible-border/50 rounded-2xl p-4 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-1">
                  Subtítulo ou Breve Resumo
                </label>
                <input
                  type="text"
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  placeholder="A revelação de Jesus Cristo..."
                  className="w-full bg-bible-dark/50 border border-bible-border/50 rounded-2xl p-4 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/20"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Tags size={12} /> Tags & Coleções
                </label>
                
                <div className="bg-bible-dark/30 rounded-2xl p-5 border border-bible-border/30">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tags.map((tag) => (
                      <motion.span 
                        layout
                        key={tag} 
                        className="bg-bible-gold/10 text-bible-gold text-[10px] px-2.5 py-1 rounded-lg border border-bible-gold/20 flex items-center gap-1.5 font-cinzel"
                      >
                        {tag}
                        <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 transition-colors">
                          <X size={10} />
                        </button>
                      </motion.span>
                    ))}
                    {tags.length === 0 && <span className="text-bible-muted/30 text-[10px] font-serif italic">Nenhuma tag selecionada</span>}
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Nova tag..."
                        className="flex-1 bg-bible-dark/50 border border-bible-border/50 rounded-xl px-4 py-3 text-bible-text focus:border-bible-gold outline-none transition-all text-sm placeholder:text-bible-muted/20"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="p-3 rounded-xl bg-bible-gold/10 text-bible-gold border border-bible-gold/20 hover:bg-bible-gold hover:text-white transition-all shadow-lg shadow-bible-gold/5"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {allExistingTags.filter(t => !tags.includes(t)).slice(0, 10).map(t => (
                        <button 
                          key={t}
                          type="button"
                          onClick={() => toggleTag(t)}
                          className="bg-white/5 hover:bg-bible-gold/10 text-bible-muted hover:text-bible-gold border border-white/5 hover:border-bible-gold/20 px-2 py-1 rounded-lg text-[9px] font-cinzel transition-all"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex-1 py-4 rounded-2xl border border-bible-border text-bible-muted font-cinzel text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!name}
                  className="flex-[1.5] py-4 rounded-2xl bg-bible-gold text-white font-cinzel text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-bible-gold/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  Adicionar ao Cânone
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
