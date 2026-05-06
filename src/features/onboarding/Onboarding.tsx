import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCustomCanonStore } from "../../store/use-custom-canon-store";
import { User, Sparkles, ArrowRight, Library } from "lucide-react";

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
            data-testid="onboarding-title"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Journey */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            data-testid="profile-personal-btn"
            onClick={() => setProfile("personal")}
            className="group relative bg-bible-card border border-bible-border rounded-[2.5rem] p-8 text-left hover:border-bible-gold transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,76,0.05)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-bible-gold/10 flex items-center justify-center text-bible-gold mb-6 group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <h2 className="font-cinzel text-xl text-bible-gold mb-3 uppercase tracking-widest leading-tight">
              {t("onboarding.personal_title")}
            </h2>
            <p className="text-bible-muted font-serif text-sm leading-relaxed mb-8 opacity-70">
              {t("onboarding.personal_desc")}
            </p>
            <div className="flex items-center gap-2 text-bible-gold font-cinzel text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {t("onboarding.start")} <ArrowRight size={14} />
            </div>
          </motion.button>

          {/* Suggestion Journey */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            data-testid="profile-suggestion-btn"
            onClick={() => setProfile("suggestion")}
            className="group relative bg-bible-card border border-bible-border rounded-[2.5rem] p-8 text-left hover:border-bible-gold transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,76,0.05)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-bible-gold/10 flex items-center justify-center text-bible-gold mb-6 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h2 className="font-cinzel text-xl text-bible-gold mb-3 uppercase tracking-widest leading-tight">
              {t("onboarding.suggestion_title")}
            </h2>
            <p className="text-bible-muted font-serif text-sm leading-relaxed mb-8 opacity-70">
              {t("onboarding.suggestion_desc")}
            </p>
            <div className="flex items-center gap-2 text-bible-gold font-cinzel text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {t("onboarding.start")} <ArrowRight size={14} />
            </div>
          </motion.button>

          {/* Conventional Journey */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            data-testid="profile-conventional-btn"
            onClick={() => setProfile("conventional")}
            className="group relative bg-bible-card border border-bible-border rounded-[2.5rem] p-8 text-left hover:border-bible-gold transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,76,0.05)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-bible-gold/10 flex items-center justify-center text-bible-gold mb-6 group-hover:scale-110 transition-transform">
              <Library size={24} />
            </div>
            <h2 className="font-cinzel text-xl text-bible-gold mb-3 uppercase tracking-widest leading-tight">
              {t("onboarding.conventional_title")}
            </h2>
            <p className="text-bible-muted font-serif text-sm leading-relaxed mb-8 opacity-70">
              {t("onboarding.conventional_desc")}
            </p>
            <div className="flex items-center gap-2 text-bible-gold font-cinzel text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              {t("onboarding.start")} <ArrowRight size={14} />
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
