import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../store/use-modal-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { X, Plus, Book as BookIcon } from "lucide-react";

export const AddBookModal = () => {
  const { isAddBookOpen, activePhaseId, closeAllModals } = useModalStore();
  const addBook = useCustomCanonStore((state) => state.addBook);
  
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !activePhaseId) return;
    
    addBook(activePhaseId, {
      num: "", // Logic in store usually handles this or we can pass one
      name,
      sub,
      tags,
    });
    
    setName("");
    setSub("");
    setTags([]);
    closeAllModals();
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-bible-card border border-bible-border rounded-[2.5rem] p-8 shadow-2xl"
          >
            <button
              onClick={closeAllModals}
              className="absolute top-6 right-6 text-bible-muted hover:text-bible-gold transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-8">
              <div className="w-12 h-12 bg-bible-gold/10 rounded-2xl flex items-center justify-center text-bible-gold mb-4 border border-bible-gold/20">
                <BookIcon size={24} />
              </div>
              <h2 className="font-cinzel text-xl text-bible-gold tracking-widest uppercase">
                Adicionar Livro
              </h2>
              <p className="text-bible-muted font-serif italic text-xs">
                Insira os detalhes do novo manuscrito.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-1">
                  Título do Livro
                </label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Isaías, Evangelho de João..."
                  className="w-full bg-bible-dark/50 border border-bible-border rounded-xl p-3.5 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-1">
                  Subtítulo ou Resumo
                </label>
                <input
                  type="text"
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  placeholder="Breve descrição do conteúdo..."
                  className="w-full bg-bible-dark/50 border border-bible-border rounded-xl p-3.5 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-1">
                  Tags (Identificação)
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-bible-gold/10 text-bible-gold text-[10px] px-2 py-1 rounded-lg border border-bible-gold/20 flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Adicionar tag..."
                    className="flex-1 bg-bible-dark/50 border border-bible-border rounded-xl p-3.5 text-bible-text focus:border-bible-gold outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="p-3.5 rounded-xl bg-bible-gold/10 text-bible-gold border border-bible-gold/20 hover:bg-bible-gold hover:text-white transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
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
                  className="flex-2 py-4 rounded-2xl bg-bible-gold text-white font-cinzel text-[10px] uppercase tracking-widest shadow-xl shadow-bible-gold/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
