import { useEffect, useMemo, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";
import ProjectsSection from "./components/ProjectsSection";
import SiteFooter from "./components/SiteFooter";
import {
  fallbackRepos,
  localeOptions,
  productCatalog,
  translations,
} from "./data/content";
import {
  extractReadmePreview,
  getInitialLanguage,
  getInitialTheme,
  sortRepos,
} from "./utils/helpers";

const GITHUB_OWNER = "hamdiituu";

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
  const [repos, setRepos] = useState(fallbackRepos);
  const [repoState, setRepoState] = useState({
    loading: true,
    hasError: false,
  });
  const [readmePreviews, setReadmePreviews] = useState({});
  const [readmeLoadingMap, setReadmeLoadingMap] = useState({});

  const t = useMemo(() => getLocalizedText(language), [language]);

  const localizedProducts = useMemo(
    () =>
      productCatalog.map((product) => {
        const translated = t.productText[product.key] || translations.en.productText[product.key];
        return {
          ...product,
          summary: translated.summary,
          focus: translated.focus,
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

  useEffect(() => {
    let isMounted = true;

    async function loadRepos() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&sort=updated`,
        );

        if (!response.ok) {
          throw new Error("GitHub data request failed.");
        }

        const data = await response.json();
        if (!isMounted) {
          return;
        }

        setRepos(sortRepos(data));
        setRepoState({
          loading: false,
          hasError: false,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setRepoState({
          loading: false,
          hasError: true,
        });
      }
    }

    loadRepos();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!repos.length) {
      return undefined;
    }

    let isMounted = true;
    const controller = new AbortController();

    const loadingState = Object.fromEntries(repos.map((repo) => [repo.id, true]));
    setReadmeLoadingMap(loadingState);

    async function loadReadmePreviews() {
      const previews = await Promise.all(
        repos.map(async (repo) => {
          try {
            const response = await fetch(
              `https://api.github.com/repos/${GITHUB_OWNER}/${repo.name}/readme`,
              {
                headers: {
                  Accept: "application/vnd.github.raw+json",
                },
                signal: controller.signal,
              },
            );

            if (!response.ok) {
              throw new Error("README unavailable.");
            }

            const markdown = await response.text();
            return [repo.id, extractReadmePreview(markdown)];
          } catch {
            return [repo.id, ""];
          }
        }),
      );

      if (!isMounted) {
        return;
      }

      setReadmePreviews((current) => ({
        ...current,
        ...Object.fromEntries(previews),
      }));
      setReadmeLoadingMap(Object.fromEntries(repos.map((repo) => [repo.id, false])));
    }

    loadReadmePreviews();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [repos]);

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

        <HeroSection t={t} />
        <ProductsSection t={t} products={localizedProducts} />
        <ProjectsSection
          t={t}
          repos={repos}
          repoState={repoState}
          readmePreviews={readmePreviews}
          readmeLoadingMap={readmeLoadingMap}
          language={language}
        />
        <SiteFooter t={t} />
      </main>
    </div>
  );
}

export default App;
