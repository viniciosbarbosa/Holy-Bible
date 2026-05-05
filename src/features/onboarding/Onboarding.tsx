import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCustomCanonStore } from "../../store/use-custom-canon-store";
import { User, Sparkles, ArrowRight } from "lucide-react";

export const Onboarding = () => {
  const { t } = useTranslation();
  const setProfile = useCustomCanonStore((state) => state.setProfile);

  return (
    <div className="fixed inset-0 z-[2000] bg-bible-dark flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-cinzel text-4xl md:text-6xl text-bible-gold tracking-[0.2em] mb-4 uppercase"
          >
            {t("onboarding.title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-bible-muted font-serif italic text-lg"
          >
            {t("onboarding.subtitle")}
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Journey */}
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setProfile("personal")}
            className="group relative bg-bible-card border border-bible-border rounded-[3rem] p-10 text-left hover:border-bible-gold transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,76,0.1)]"
          >
            <div className="w-16 h-16 rounded-3xl bg-bible-gold/10 flex items-center justify-center text-bible-gold mb-8 group-hover:scale-110 transition-transform duration-500">
              <User size={32} />
            </div>
            <h2 className="font-cinzel text-2xl text-bible-gold mb-4 uppercase tracking-widest">
              {t("onboarding.personal_title")}
            </h2>
            <p className="text-bible-muted font-serif leading-relaxed mb-10">
              {t("onboarding.personal_desc")}
            </p>
            <div className="flex items-center gap-2 text-bible-gold font-cinzel text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {t("onboarding.start")} <ArrowRight size={16} />
            </div>
          </motion.button>

          {/* Suggestion Journey */}
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => setProfile("suggestion")}
            className="group relative bg-bible-card border border-bible-border rounded-[3rem] p-10 text-left hover:border-bible-gold transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,76,0.1)]"
          >
            <div className="w-16 h-16 rounded-3xl bg-bible-gold/10 flex items-center justify-center text-bible-gold mb-8 group-hover:scale-110 transition-transform duration-500">
              <Sparkles size={32} />
            </div>
            <h2 className="font-cinzel text-2xl text-bible-gold mb-4 uppercase tracking-widest">
              {t("onboarding.suggestion_title")}
            </h2>
            <p className="text-bible-muted font-serif leading-relaxed mb-10">
              {t("onboarding.suggestion_desc")}
            </p>
            <div className="flex items-center gap-2 text-bible-gold font-cinzel text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {t("onboarding.start")} <ArrowRight size={16} />
            </div>
          </motion.button>
        </div>

        <footer className="mt-20 text-center text-bible-muted/30 font-cinzel text-[10px] tracking-[0.5em] uppercase">
          Holy Bible Journey Engine v2.0
        </footer>
      </div>
    </div>
  );
};
