import { useEffect, useMemo, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import ProfileSidebar from "./components/ProfileSidebar";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";
import ProjectsSection from "./components/ProjectsSection";
import SiteFooter from "./components/SiteFooter";
import cvmakesPreview from "./assets/cvmakes-preview.png";
import adres100Preview from "./assets/adres100-preview.png";
import legiflarePreview from "./assets/legiflare-preview.png";
import githubReposSnapshot from "./data/githubReposSnapshot.json";
import {
  localeOptions,
  productCatalog,
  translations,
} from "./data/content";
import {
  getInitialLanguage,
  getInitialTheme,
  sortRepos,
} from "./utils/helpers";

const productPreviewByKey = {
  cvmakes: cvmakesPreview,
  adres100: adres100Preview,
  legiflare: legiflarePreview,
};

function getLocalizedText(language) {
  const english = translations.en;
  const current = translations[language] || english;

  return {
    ...english,
    ...current,
    productText: {
      ...english.productText,
      ...(current.productText || {}),
    },
  };
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [repos] = useState(() => sortRepos(githubReposSnapshot));
  const repoState = {
    loading: false,
    hasError: false,
    errorKey: "repoError",
  };

  const t = useMemo(() => getLocalizedText(language), [language]);

  const localizedProducts = useMemo(
    () =>
      productCatalog.map((product) => {
        const translated = t.productText[product.key] || translations.en.productText[product.key];
        return {
          ...product,
          summary: translated.summary,
          focus: translated.focus,
          previewImage: productPreviewByKey[product.key],
        };
      }),
    [t],
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("language", language);
  }, [language]);

  return (
    <div className="page-shell">
      <main className="layout">
        <SiteHeader
          t={t}
          language={language}
          localeOptions={localeOptions}
          theme={theme}
          onLanguageChange={setLanguage}
          onThemeToggle={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
        />

        <div className="github-shell">
          <ProfileSidebar
            t={t}
            productCount={localizedProducts.length}
            repoCount={repos.length}
          />

          <section className="main-feed">
            <HeroSection t={t} />
            <ProductsSection t={t} products={localizedProducts} />
            <ProjectsSection
              t={t}
              repos={repos}
              repoState={repoState}
              language={language}
            />
            <SiteFooter t={t} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
