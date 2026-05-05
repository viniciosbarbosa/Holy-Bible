import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PlusCircle, Library, Bookmark, Search } from "lucide-react";
import { PhaseSection } from "../components/PhaseSection";
import { StatsHeader } from "../components/StatsHeader";
import { EditBookModal } from "../components/EditBookModal";
import { AddPhaseModal } from "../components/AddPhaseModal";
import { AddBookModal } from "../components/AddBookModal";
import { PersonalFavorites } from "../components/PersonalFavorites";
import { useModalStore } from "../../../store/use-modal-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { useAppStore } from "../../../store/use-app-store";

export default function CustomCanon() {
  const { personalPhases, suggestionPhases, activeProfile } =
    useCustomCanonStore();
  const allPhases =
    activeProfile === "suggestion" ? suggestionPhases : personalPhases;

  const setBackgroundFromTheme = useAppStore(
    (state) => state.setBackgroundFromTheme,
  );
  const { openAddPhase } = useModalStore();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"books" | "favorites">("books");
  const [search, setSearch] = useState("");

  const filteredPhases = allPhases.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.books.some((b) => b.name.toLowerCase().includes(search.toLowerCase())),
  );

  // Performance: Load phases in chunks to avoid UI freeze
  const [visibleCount, setVisibleCount] = useState(2);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to allow the layout to settle before rendering more
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (visibleCount < allPhases.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 3, allPhases.length));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, allPhases.length, isReady]);

  const displayedPhases = filteredPhases.slice(0, visibleCount);

  return (
    <div className="relative z-10">
      <StatsHeader />

      <div className="max-w-5xl mx-auto mt-12 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 gap-6">
          {/* Tab Switcher */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex bg-bible-card/50 backdrop-blur-xl p-1.5 rounded-2xl border border-bible-gold/20 shadow-inner">
              <button
                onClick={() => setActiveTab("books")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cinzel text-[10px] uppercase tracking-widest transition-all ${
                  activeTab === "books"
                    ? "bg-bible-gold text-white shadow-lg shadow-bible-gold/20"
                    : "text-bible-muted hover:text-bible-gold"
                }`}
              >
                <Library size={14} /> Biblioteca
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-cinzel text-[10px] uppercase tracking-widest transition-all ${
                  activeTab === "favorites"
                    ? "bg-bible-gold text-white shadow-lg shadow-bible-gold/20"
                    : "text-bible-muted hover:text-bible-gold"
                }`}
              >
                <Bookmark size={14} /> Versículos
              </button>
            </div>

            {/* Search Bar */}
            {activeTab === "books" && (
              <div className="relative w-full md:w-80 group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-bible-muted group-focus-within:text-bible-gold transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar livros ou fases..."
                  className="w-full bg-bible-card/50 backdrop-blur-xl border border-bible-gold/10 rounded-2xl py-3 pl-12 pr-4 text-bible-text text-sm focus:border-bible-gold outline-none transition-all"
                />
              </div>
            )}
          </div>

          <button
            onClick={openAddPhase}
            className="flex items-center gap-2 bg-bible-gold text-white px-6 py-2.5 rounded-2xl transition-all font-cinzel text-xs uppercase tracking-widest shadow-xl shadow-bible-gold/20 hover:scale-105 active:scale-95"
          >
            <PlusCircle size={16} /> {t("common.add_phase")}
          </button>
        </div>

        <div className="px-4 space-y-6 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === "favorites" ? (
              <motion.div
                key="favs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PersonalFavorites />
              </motion.div>
            ) : (
              <motion.div key="books" className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {displayedPhases.map((phase, idx) => (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <PhaseSection
                        phase={phase}
                        onOpen={() => setBackgroundFromTheme(phase.theme)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {allPhases.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 border-2 border-dashed border-bible-border rounded-[3rem] bg-bible-card backdrop-blur-sm"
                  >
                    <PlusCircle
                      size={48}
                      className="mx-auto text-bible-gold/30 mb-4"
                    />
                    <p className="text-bible-muted font-serif text-lg">
                      Sua jornada ainda não começou. <br />
                      Crie sua primeira fase e comece a organizar sua
                      biblioteca.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <footer className="mt-32 mb-12 text-center text-bible-muted font-cinzel text-[10px] uppercase tracking-[0.5em] opacity-30">
        In Principio Erat Verbum
      </footer>

      <EditBookModal />
      <AddPhaseModal />
      <AddBookModal />
    </div>
  );
}
