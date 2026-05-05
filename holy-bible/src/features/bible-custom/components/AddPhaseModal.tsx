import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../store/use-modal-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import { BibleTheme, DEFAULT_WALLPAPERS } from "../../../@types/bible";

export const AddPhaseModal = () => {
  const { isAddPhaseOpen, closeAllModals } = useModalStore();
  const { phases, addPhase, addPhaseWithBook } = useCustomCanonStore();
  
  const nextPhaseNum = phases.length + 1;
  
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<BibleTheme>("genesis");
  
  // Book fields for Step 2
  const [bookTitle, setBookTitle] = useState("");
  const [bookSub, setBookSub] = useState("");

  const reset = () => {
    setTitle("");
    setTheme("genesis");
    setBookTitle("");
    setBookSub("");
    setStep(1);
  };

  const handleFinalSubmit = () => {
    if (!title) return;
    
    const phaseData = {
      num: String(nextPhaseNum),
      title,
      theme,
    };

    if (bookTitle) {
      addPhaseWithBook(phaseData, {
        num: "1",
        name: bookTitle,
        sub: bookSub,
        tags: [],
        savedVerses: [],
      });
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
            className="relative w-full max-w-lg bg-bible-card border border-bible-border rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={() => { reset(); closeAllModals(); }}
              className="absolute top-6 right-6 text-bible-muted hover:text-bible-gold transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-bible-gold text-white px-2 py-0.5 rounded-md font-cinzel text-[10px] font-bold">
                  FASE {nextPhaseNum}
                </span>
                <div className="h-px flex-1 bg-bible-border opacity-30" />
              </div>
              <h2 className="font-cinzel text-2xl text-bible-gold tracking-widest uppercase">
                {step === 1 ? "Nova Fase" : "Primeiro Livro"}
              </h2>
              <p className="text-bible-muted font-serif italic text-sm">
                {step === 1 
                  ? "Defina o título e a atmosfera desta nova etapa." 
                  : "Adicione o primeiro livro para iniciar esta fase agora mesmo."}
              </p>
            </header>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2">
                      Título da Fase
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Profetas Maiores, O Novo Testamento..."
                      className="w-full bg-bible-dark/50 border border-bible-border rounded-2xl p-4 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/50"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2">
                      Ambiente (Tema)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.keys(DEFAULT_WALLPAPERS).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t as BibleTheme)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            theme === t ? "border-bible-gold scale-105 shadow-lg shadow-bible-gold/20" : "border-transparent opacity-50 hover:opacity-100"
                          }`}
                        >
                          <img 
                            src={DEFAULT_WALLPAPERS[t as BibleTheme]} 
                            className="w-full h-full object-cover" 
                            alt={t}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-[6px] font-cinzel text-white uppercase text-center p-1 leading-tight">
                              {t.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!title}
                      className="w-full py-4 rounded-2xl bg-bible-gold text-white font-cinzel text-xs uppercase tracking-widest shadow-xl shadow-bible-gold/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      Próximo Passo <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2">
                        Título do Livro
                      </label>
                      <input
                        autoFocus
                        type="text"
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder="Ex: Isaías, Gênesis..."
                        className="w-full bg-bible-dark/50 border border-bible-border rounded-2xl p-4 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-cinzel text-bible-gold uppercase tracking-[0.2em] ml-2">
                        Subtítulo (Opcional)
                      </label>
                      <input
                        type="text"
                        value={bookSub}
                        onChange={(e) => setBookSub(e.target.value)}
                        placeholder="Ex: O Profeta Messiânico..."
                        className="w-full bg-bible-dark/50 border border-bible-border rounded-2xl p-4 text-bible-text focus:border-bible-gold outline-none transition-all placeholder:text-bible-muted/50"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <button
                      onClick={handleFinalSubmit}
                      className="w-full py-4 rounded-2xl bg-bible-gold text-white font-cinzel text-xs uppercase tracking-widest shadow-xl shadow-bible-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {bookTitle ? "Finalizar e Adicionar Livro" : "Pular e Finalizar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full py-3 text-bible-muted font-cinzel text-[10px] uppercase tracking-widest hover:text-bible-gold transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={14} /> Voltar para Fase
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
