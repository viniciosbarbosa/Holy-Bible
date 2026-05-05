import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../store/use-modal-store";
import { useBibleStore } from "../../../store/use-bible-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { X, Bookmark, Download, AlertCircle, Trash2, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

export const EditBookModal = () => {
  const { isEditBookOpen, activeBookId, activePhaseId, closeAllModals } = useModalStore();
  const { setAcquisition, acquisitionStatus } = useBibleStore();
  const phases = useCustomCanonStore((state) => state.phases);
  const deleteBook = useCustomCanonStore((state) => state.deleteBook);
  const updateBook = useCustomCanonStore((state) => state.updateBook);
  const addVerse = useCustomCanonStore((state) => state.addVerse);
  const deleteVerse = useCustomCanonStore((state) => state.deleteVerse);
  const { t } = useTranslation();
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [newVerseText, setNewVerseText] = useState("");
  const [newVerseRef, setNewVerseRef] = useState("");

  // Select the actual book from the store to ensure reactivity
  const activeBook = activePhaseId && activeBookId 
    ? phases.find(p => p.id === activePhaseId)?.books.find(b => b.id === activeBookId)
    : null;

  if (!activeBook || !activePhaseId) return null;

  const currentStatus = acquisitionStatus[activeBook.id] || "none";

  const handleAddVerse = () => {
    if (!newVerseText || !newVerseRef) return;
    const [chapter, verse] = newVerseRef.split(/[.: ]+/).map(Number);
    
    addVerse(activePhaseId, activeBook.id, {
      chapter: chapter || 1,
      verse: verse || 1,
      text: newVerseText,
    });
    setNewVerseText("");
    setNewVerseRef("");
  };

  const statusOptions = [
    { id: "none", label: "Tenho", icon: Bookmark, color: "text-bible-gold" },
    { id: "missing", label: "Faltando", icon: AlertCircle, color: "text-red-500" },
    { id: "acquired", label: "Comprado", icon: Bookmark, color: "text-green-500" },
    { id: "downloaded", label: "Baixado", icon: Download, color: "text-blue-500" },
  ] as const;

  const confirmDelete = () => {
    deleteBook(activePhaseId, activeBook.id);
    setShowConfirmDelete(false);
    closeAllModals();
  };

  return (
    <>
      <AnimatePresence>
        {isEditBookOpen && !showConfirmDelete && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAllModals}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-bible-card border border-bible-border rounded-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={closeAllModals}
                className="absolute top-6 right-6 text-bible-muted hover:text-bible-gold transition-colors"
              >
                <X size={24} />
              </button>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Column 1: Config & Status */}
                <div className="space-y-8">
                  <header>
                    <span className="text-bible-gold font-cinzel text-[10px] uppercase tracking-[0.3em] opacity-60">
                      Manuscrito ID: {activeBook.num}
                    </span>
                    <input
                      type="text"
                      value={activeBook.name}
                      onChange={(e) => updateBook(activePhaseId, activeBook.id, { name: e.target.value })}
                      className="w-full bg-transparent text-3xl text-bible-text font-serif mt-1 border-b border-bible-border focus:border-bible-gold outline-none pb-2 transition-colors"
                    />
                  </header>

                  <div className="space-y-4">
                    <h3 className="text-[10px] text-bible-muted uppercase tracking-widest font-cinzel">Status de Aquisição</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setAcquisition(activeBook.id, opt.id as any)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all
                            ${currentStatus === opt.id ? "border-bible-gold bg-bible-gold/5 text-bible-gold" : "border-bible-border bg-bible-dark/30 text-bible-muted hover:border-bible-gold/30"}`}
                        >
                          <opt.icon size={20} className="mb-2" />
                          <span className="text-[10px] font-cinzel uppercase tracking-tighter">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowConfirmDelete(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 text-red-900/40 font-cinzel text-[10px] hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all uppercase tracking-widest border border-transparent hover:border-red-500/30"
                  >
                    <Trash2 size={12} /> {t("common.delete")}
                  </button>
                </div>

                {/* Column 2: Verses Management */}
                <div className="bg-bible-dark/50 rounded-[2rem] p-6 border border-bible-border flex flex-col h-full">
                  <h3 className="text-[10px] text-bible-gold uppercase tracking-widest font-cinzel mb-6 flex items-center gap-2">
                    <Quote size={14} /> Versículos Sagrados
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-6 min-h-[200px]">
                    {activeBook.savedVerses?.map((v) => (
                      <div key={v.id} className="group relative bg-bible-card/50 p-4 rounded-xl border border-bible-border hover:border-bible-gold/30 transition-all">
                        <p className="text-xs text-bible-gold font-cinzel mb-1">{activeBook.name} {v.chapter}:{v.verse}</p>
                        <p className="text-sm font-serif text-bible-text leading-relaxed">"{v.text}"</p>
                        <button 
                          onClick={() => deleteVerse(activePhaseId, activeBook.id, v.id)}
                          className="absolute top-2 right-2 p-1 text-bible-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {(!activeBook.savedVerses || activeBook.savedVerses.length === 0) && (
                      <p className="text-bible-muted/30 font-serif italic text-center py-10 text-sm">
                        Nenhum versículo salvo para este livro.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-bible-border">
                    <input
                      type="text"
                      placeholder="Ref (ex: 1.5)"
                      value={newVerseRef}
                      onChange={(e) => setNewVerseRef(e.target.value)}
                      className="w-full bg-bible-card border border-bible-border rounded-xl px-4 py-2 text-xs font-cinzel outline-none focus:border-bible-gold"
                    />
                    <textarea
                      placeholder="Texto do versículo..."
                      value={newVerseText}
                      onChange={(e) => setNewVerseText(e.target.value)}
                      className="w-full bg-bible-card border border-bible-border rounded-xl px-4 py-2 text-sm font-serif outline-none focus:border-bible-gold h-20 resize-none"
                    />
                    <button 
                      onClick={handleAddVerse}
                      className="w-full bg-bible-gold text-white py-3 rounded-xl font-cinzel text-[10px] tracking-widest uppercase hover:scale-[1.02] transition-all"
                    >
                      Salvar Versículo
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmDelete(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-bible-dark border border-red-500/20 rounded-[2.5rem] p-8 shadow-2xl text-center"
            >
              <Trash2 size={48} className="mx-auto text-red-500 mb-6" />
              <h3 className="font-cinzel text-xl text-bible-text mb-2">Excluir Livro?</h3>
              <p className="text-bible-muted mb-8 font-serif">
                Isso removerá todos os dados e versículos de "{activeBook.name}".
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-bible-border hover:bg-white/5 text-bible-text font-cinzel text-[10px]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-cinzel text-[10px] shadow-lg shadow-red-500/20"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
