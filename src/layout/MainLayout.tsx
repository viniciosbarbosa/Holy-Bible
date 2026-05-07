import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import Parallax from "parallax-js";
import { useAppStore } from "../store/use-app-store";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../store/use-modal-store";
import { useCustomCanonStore } from "../store/use-custom-canon-store";
import { Onboarding } from "../features/onboarding/Onboarding";
import { DEFAULT_WALLPAPERS } from "../@types/bible";
import { Sun, Moon, Library, BookOpen } from "lucide-react";

export const MainLayout = () => {
  const location = useLocation();
  const sceneRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const isAnyModalOpen = useModalStore((state) => state.isAnyModalOpen());
  const activeProfile = useCustomCanonStore((state) => state.activeProfile);

  const currentBackground = useAppStore((state) => state.currentBackground);
  const setBackgroundFromTheme = useAppStore(
    (state) => state.setBackgroundFromTheme,
  );

  const { t, i18n } = useTranslation();
  const syncLanguage = useCustomCanonStore((state) => state.syncLanguage);

  useEffect(() => {
    syncLanguage(i18n.language);
  }, [i18n.language, syncLanguage]);

  const navItems = [
    { path: "/my-personal-bible", label: t("nav.my_bible"), icon: Library },
    { path: "/default-bible", label: t("nav.default_bible"), icon: BookOpen },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (sceneRef.current) {
      const parallaxInstance = new Parallax(sceneRef.current, {
        relativeInput: true,
      });
      return () => parallaxInstance.destroy();
    }
  }, []);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== DEFAULT_WALLPAPERS.genesis) {
      target.src = DEFAULT_WALLPAPERS.genesis;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden transition-colors duration-700 bg-bible-dark text-bible-text font-serif">
      <AnimatePresence>{!activeProfile && <Onboarding />}</AnimatePresence>

      {/* Background Master Parallax */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div ref={sceneRef} className="absolute -inset-[10%] w-[120%] h-[120%]">
          <div data-depth="0.1" className="w-full h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentBackground}
                src={currentBackground}
                onError={handleImageError}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.8, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover contrast-110 transition-all duration-1000"
                alt="Plano de fundo geral"
              />
            </AnimatePresence>
          </div>
        </div>
        <div className="absolute inset-0 bg-[hsl(var(--bible-overlay))] opacity-40" />
        <div className="absolute inset-0 bg-bible-gold/5 mix-blend-soft-light" />
      </div>

      {/* App Header / Logo */}
      <AnimatePresence>
        {!isAnyModalOpen && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="relative z-50 pt-6 md:pt-12 pb-2 md:pb-4 text-center"
          >
            <div className="inline-block group cursor-default">
              <h1 className="font-cinzel text-2xl md:text-5xl tracking-[0.3em] uppercase text-bible-gold drop-shadow-[0_2px_15px_rgba(201,168,76,0.3)] transition-all group-hover:tracking-[0.4em] duration-1000">
                Holy Bible
              </h1>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-bible-gold to-transparent mt-1 md:mt-2 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="relative z-10 pb-32 max-w-6xl mx-auto px-4 md:px-8">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Dock Navigation */}
      <AnimatePresence>
        {!isAnyModalOpen && (
          <motion.nav
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-[50] flex items-center p-2 rounded-2xl bg-bible-card/80 backdrop-blur-xl border border-bible-gold/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (item.path === "/default-bible")
                        setBackgroundFromTheme("prophets");
                      if (item.path === "/my-personal-bible")
                        setBackgroundFromTheme("genesis");
                    }}
                    className={`relative flex flex-col items-center justify-center min-w-[80px] h-14 md:h-16 px-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-bible-gold text-white shadow-[0_0_15px_rgba(201,168,76,0.5)]"
                        : "text-bible-muted hover:text-bible-gold hover:bg-white/5"
                    }`}
                  >
                    <item.icon size={isActive ? 22 : 20} />
                    <span className="text-[9px] md:text-[10px] font-cinzel uppercase mt-1 tracking-widest whitespace-nowrap">
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="dock-active"
                        className="absolute inset-0 rounded-xl bg-bible-gold -z-10"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </Link>
                );
              })}

              <div className="w-px h-8 bg-white/10 mx-2" />

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl text-bible-gold hover:bg-white/5 transition-all"
                title="Alternar Tema"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};
