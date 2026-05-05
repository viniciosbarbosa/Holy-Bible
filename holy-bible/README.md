# Holy Bible – Personal & Conventional Bible Management

A modern, immersive web app built with **React, TypeScript, and Vite** that lets you explore, personalize, and organize biblical texts.

## ✨ Key Features

- **Multi‑Profile Architecture** – Choose between:
  - **Personal (My Own Journey)** – Build your own phases, add books, set custom wallpapers, and manage verses.
  - **Suggested (Guided)** – Start with a curated canon of 250+ books across 19 historical phases.
- **Onboarding Flow** – First‑time users are prompted to pick a profile, ensuring a smooth start.
- **Dynamic Add‑Phase Modal** – Add a phase and **multiple books at once** with instant preview.
- **Global Search** – Search for books or phases in both the Personal and Conventional sections.
- **Full i18n Support** – Detects browser language automatically (English & Portuguese) and translates UI strings, including statistics.
- **Statistics Header** – Shows reading progress (`{{read}} of {{total}} Books`) for the active profile.
- **Premium UI** – Rich gradients, glass‑morphism cards, subtle micro‑animations, and dark‑mode aware design.
- **Custom Wallpapers** – Each phase can have its own background image; curated wallpapers are stored in `DEFAULT_WALLPAPERS`.

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/viniciosbarbosa/Holy-Bible.git
cd Holy-Bible/holy-bible

# Install dependencies
npm ci

# Run in development mode
npm run dev
```

Open <http://localhost:5173> in your browser.

## 📦 Build for Production

```bash
npm run build   # Generates an optimized static bundle in ./dist
```

## 🛠️ Project Structure (high‑level)

```
src/
├─ @types/                # Type definitions (Book, Phase, etc.)
├─ features/
│   ├─ bible-custom/      # Personal profile UI & logic
│   ├─ bible-api/         # Conventional profile (API‑driven)
│   └─ onboarding/        # First‑time profile selector
├─ store/                 # Zustand stores (custom canon, modal, app)
├─ layout/                # MainLayout with theme & parallax handling
├─ i18n.ts                # Translation resources (en / pt)
└─ index.css              # Global design tokens & dark‑mode variables
```

## 🌐 Internationalization

The app uses **i18next** with `i18next-browser-languagedetector`. Translation keys are defined in `src/i18n.ts`. Add new languages by extending the `resources` object.

## 🎨 Custom Wallpapers

Backgrounds for each phase are defined in `src/@types/bible.ts` under `DEFAULT_WALLPAPERS`. Feel free to replace URLs with your own images – they are loaded automatically based on the selected theme.

## 🧭 Navigation

- **/my-personal-bible** – Personal profile (My Own Journey)
- **/default-bible** – Conventional profile (Suggested canon)
- **/read/:abbr/:chapter** – Reader view for a specific book.

## 🧪 Testing

```bash
npm run test      # Runs Jest test suite
npm run test:watch # Watch mode
```

## 📄 License

This project is open‑source under the MIT License.

---

Made with ❤️ by **Vinícios Barbosa**.
