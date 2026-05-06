import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../store/use-modal-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { X, ArrowRight, ArrowLeft, PlusCircle, Hash, Tags } from "lucide-react";
import { BibleTheme, DEFAULT_WALLPAPERS, Book } from "../../../@types/bible";
import { BUILT_IN_TAGS } from "../constants/tags";

export const AddPhaseModal = () => {
  const { isAddPhaseOpen, closeAllModals } = useModalStore();
  const { personalPhases, suggestionPhases, activeProfile, addPhase, addPhaseWithBooks } = useCustomCanonStore();
  
  const phases = activeProfile === "suggestion" ? suggestionPhases : personalPhases;
  const nextPhaseNum = useMemo(() => {
    const nums = phases.map(p => {
      const match = p.num.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    });
    return (nums.length > 0 ? Math.max(...nums) : 0) + 1;
  }, [phases]);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<BibleTheme>("genesis");
  
  // Book fields for Step 2
  const [books, setBooks] = useState<Omit<Book, "id">[]>([]);
  const [currentBookTitle, setCurrentBookTitle] = useState("");
  const [currentBookSub, setCurrentBookSub] = useState("");
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const allExistingTags = useMemo(() => {
    const tagsSet = new Set<string>();
    Object.values(BUILT_IN_TAGS).forEach(t => tagsSet.add(t.lbl));
    phases.forEach(p => p.books.forEach(b => b.tags.forEach(t => tagsSet.add(t))));
    return Array.from(tagsSet).sort();
  }, [phases]);

  const reset = () => {
    setTitle("");
    setTheme("genesis");
    setBooks([]);
    setCurrentBookTitle("");
    setCurrentBookSub("");
    setCurrentTags([]);
    setStep(1);
    setIsSubmitting(false);
  };

  const handleAddCurrentBook = () => {
    if (!currentBookTitle) return;
    setBooks([...books, { 
      num: String(books.length + 1), 
      name: currentBookTitle, 
      sub: currentBookSub, 
      tags: currentTags, 
      savedVerses: [] 
    }]);
    setCurrentBookTitle("");
    setCurrentBookSub("");
    setCurrentTags([]);
  };

  const toggleTag = (tag: string) => {
    if (currentTags.includes(tag)) {
      setCurrentTags(currentTags.filter(t => t !== tag));
    } else {
      setCurrentTags([...currentTags, tag]);
    }
  };

  const handleFinalSubmit = () => {
    if (!title || isSubmitting) return;
    setIsSubmitting(true);
    
    const phaseData = {
      num: String(nextPhaseNum),
      title,
      theme,
    };

    const finalBooks = [...books];
    if (currentBookTitle) {
      finalBooks.push({
        num: String(books.length + 1),
        name: currentBookTitle,
        sub: currentBookSub,
        tags: currentTags,
        savedVerses: [],
      });
    }

    if (finalBooks.length > 0) {
      addPhaseWithBooks(phaseData, finalBooks);
    } else {
      addPhase(phaseData);
    }
    
    reset();
    closeAllModals();
  };

  return (
    <AnimatePresence>
      {isAddPhaseOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { reset(); closeAllModals(); }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-label="Add Phase"
            data-testid="add-phase-modal"
            className="relative w-full max-w-xl bg-bible-card border border-bible-border rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={() => { reset(); closeAllModals(); }}
              className="absolute top-8 right-8 text-bible-muted hover:text-bible-gold transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-bible-gold text-white px-3 py-1 rounded-lg font-cinzel text-[11px] font-bold tracking-widest shadow-lg shadow-bible-gold/20">
                  FASE {nextPhaseNum}
                </span>
                <div className="h-px flex-1 bg-bible-gold/20" />
              </div>
              <h2 className="font-cinzel text-2xl text-bible-gold tracking-widest uppercase">
                {step === 1 ? "Nova Jornada" : "O Primeiro Registro"}
              </h2>
              <p className="text-bible-muted font-serif italic text-sm mt-1 opacity-60">
                {step === 1 
                  ? "Defina o título e a atmosfera visual desta nova etapa." 
                  : "Adicione o manuscrito inicial para começar sua biblioteca."}
              </p>
            </header>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                      <Hash size={10} /> Título da Fase
                    </label>
                    <input
                      autoFocus
                      type="text"
                      id="phase-title"
                      data-testid="phase-title-input"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Profetas Maiores, O Alvorecer..."
                      className="w-full bg-bible-dark/50 border border-bible-border/50 rounded-2xl p-4 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/20"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2">
                      Atmosfera (Tema Visual)
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {Object.keys(DEFAULT_WALLPAPERS).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t as BibleTheme)}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${
                            theme === t ? "border-bible-gold scale-105 shadow-xl shadow-bible-gold/20" : "border-transparent opacity-40 hover:opacity-100"
                          }`}
                        >
                          <img 
                            src={DEFAULT_WALLPAPERS[t as BibleTheme]} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            alt={t}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="text-[7px] font-cinzel text-white uppercase text-center p-1 leading-tight tracking-tighter">
                              {t.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      data-testid="phase-next-btn"
                      onClick={() => setStep(2)}
                      disabled={!title}
                      className="w-full py-4 rounded-2xl bg-bible-gold text-white font-cinzel text-xs uppercase tracking-[0.3em] shadow-xl shadow-bible-gold/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      Continuar <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {books.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-bible-gold/20">
                      {books.map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-bible-gold/5 p-4 rounded-xl border border-bible-gold/10">
                          <div className="flex flex-col">
                            <span className="font-cinzel text-[10px] text-bible-gold uppercase tracking-widest">{b.name}</span>
                            <span className="text-[9px] text-bible-muted italic font-serif">{b.sub}</span>
                          </div>
                          <button onClick={() => setBooks(books.filter((_, idx) => idx !== i))} className="text-red-500/30 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2">
                          Título do Livro
                        </label>
                        <input
                          autoFocus
                          type="text"
                          value={currentBookTitle}
                          onChange={(e) => setCurrentBookTitle(e.target.value)}
                          placeholder="Ex: Gênesis, Atos..."
                          className="w-full bg-bible-dark/50 border border-bible-border/50 rounded-2xl p-4 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2">
                          Descrição
                        </label>
                        <input
                          type="text"
                          value={currentBookSub}
                          onChange={(e) => setCurrentBookSub(e.target.value)}
                          placeholder="A origem de todas as coisas..."
                          className="w-full bg-bible-dark/50 border border-bible-border/50 rounded-2xl p-4 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/20"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                          <Tags size={12} /> Tags Sugeridas
                        </label>
                        <div className="flex flex-wrap gap-1.5 p-4 bg-bible-dark/30 rounded-2xl border border-bible-border/30">
                          {currentTags.map(t => (
                            <span key={t} className="bg-bible-gold/20 text-bible-gold px-2 py-1 rounded-lg text-[9px] font-cinzel border border-bible-gold/30 flex items-center gap-1">
                              {t} <button onClick={() => toggleTag(t)}><X size={10}/></button>
                            </span>
                          ))}
                          {allExistingTags.filter(t => !currentTags.includes(t)).slice(0, 8).map(t => (
                            <button 
                              key={t}
                              onClick={() => toggleTag(t)}
                              className="bg-white/5 hover:bg-bible-gold/10 text-bible-muted hover:text-bible-gold px-2 py-1 rounded-lg text-[9px] font-cinzel transition-all border border-transparent hover:border-bible-gold/20"
                            >
                              + {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleAddCurrentBook}
                      disabled={!currentBookTitle}
                      className="w-full py-4 rounded-2xl border border-dashed border-bible-gold/30 text-bible-gold font-cinzel text-[10px] uppercase tracking-[0.3em] hover:bg-bible-gold/5 transition-all flex items-center justify-center gap-2"
                    >
                      <PlusCircle size={16} /> Adicionar outro Livro
                    </button>
                  </div>

                  <div className="pt-6 flex flex-col gap-4">
                    <button
                      data-testid="phase-finish-btn"
                      onClick={handleFinalSubmit}
                      className="w-full py-5 rounded-2xl bg-bible-gold text-white font-cinzel text-xs uppercase tracking-[0.3em] shadow-xl shadow-bible-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Concluir Criação
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full py-3 text-bible-muted font-cinzel text-[10px] uppercase tracking-widest hover:text-bible-gold transition-all flex items-center justify-center gap-2 opacity-50"
                    >
                      <ArrowLeft size={14} /> Voltar aos detalhes
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
