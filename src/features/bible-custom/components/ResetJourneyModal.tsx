import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Upload, RotateCcw, AlertTriangle, FileJson } from "lucide-react";
import { useModalStore } from "../../../store/use-modal-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { useTranslation } from "react-i18next";
import { exportData, importData } from "../../../utils/backup-system";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const ResetJourneyModal = () => {
  const { isResetModalOpen, closeAllModals } = useModalStore();
  const activeProfile = useCustomCanonStore((state) => state.activeProfile);
  const clearStore = useCustomCanonStore((state) => state.clearStore);
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!isResetModalOpen) return null;

  const handleExport = () => {
    exportData();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importData(file);
      if (success) {
        window.location.reload(); // Hard reload to ensure stores re-sync from localStorage
      } else {
        alert("Falha ao importar dados. Verifique o arquivo.");
      }
    }
  };

  const handleReset = () => {
    clearStore();
    closeAllModals();
    navigate("/", { replace: true });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAllModals}
          className="absolute inset-0 bg-bible-dark/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-bible-card border border-bible-border rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-bible-border flex justify-between items-center bg-bible-gold/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-bible-gold/10 flex items-center justify-center text-bible-gold">
                <FileJson size={20} />
              </div>
              <h2 className="font-cinzel text-lg text-bible-gold tracking-wider uppercase">
                {t("common.manage_data")}
              </h2>
            </div>
            <button
              onClick={closeAllModals}
              className="p-2 hover:bg-bible-gold/10 rounded-full text-bible-muted transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {activeProfile && (
              <>
                {/* Export */}
                <button
                  onClick={handleExport}
                  className="w-full group flex items-center gap-4 p-4 bg-bible-gold/5 border border-bible-gold/20 rounded-2xl hover:bg-bible-gold/10 hover:border-bible-gold/40 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-bible-gold/10 flex items-center justify-center text-bible-gold group-hover:scale-110 transition-transform">
                    <Download size={24} />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-sm text-bible-gold uppercase tracking-widest">
                      {t("common.export_backup")}
                    </h3>
                    <p className="text-[10px] text-bible-muted font-serif italic mt-1 leading-tight">
                      {t("common.export_desc")}
                    </p>
                  </div>
                </button>
                <div className="h-px bg-bible-border/50" />
              </>
            )}

            {/* Import */}
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full group flex items-center gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/40 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <div>
                  <h3 className="font-cinzel text-sm text-blue-400 uppercase tracking-widest">
                    {t("common.import_backup")}
                  </h3>
                  <p className="text-[10px] text-bible-muted font-serif italic mt-1 leading-tight">
                    {t("common.import_desc")}
                  </p>
                </div>
              </button>
            </div>

            {activeProfile && (
              <>
                <div className="h-px bg-bible-border/50" />

                {/* Reset */}
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-500/70 font-serif leading-relaxed uppercase tracking-wider">
                      {t("confirm.restart_confirm")}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-cinzel text-[10px] tracking-[0.2em] uppercase transition-all duration-300"
                  >
                    {t("common.restart_journey")}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
