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
  isReadmeCacheFresh,
  readReadmeCache,
  readRepoCache,
  sortRepos,
  writeReadmeCache,
  writeRepoCache,
} from "./utils/helpers";

const GITHUB_OWNER = "hamdiituu";
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
          previewImage: productPreviewByKey[product.key],
        };
      }),
    [t],
  );

  const reposWithReadme = useMemo(
    () => repos.filter((repo) => Boolean((readmePreviews[repo.id] || "").trim())),
    [repos, readmePreviews],
  );

  const isReadmeLoading = useMemo(
    () => repos.some((repo) => Boolean(readmeLoadingMap[repo.id])),
    [repos, readmeLoadingMap],
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
      const cachedRepos = readRepoCache();

      if (cachedRepos.length && isMounted) {
        setRepos(cachedRepos);
      }

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

        const sorted = sortRepos(data);
        setRepos(sorted);
        writeRepoCache(sorted);
        setReadmePreviews({});
        setReadmeLoadingMap({});
        setRepoState({
          loading: false,
          hasError: false,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        if (cachedRepos.length > 0) {
          setRepos(cachedRepos);
          setRepoState({
            loading: false,
            hasError: false,
          });
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
    const readmeCache = readReadmeCache();

    const cachedPreviews = {};
    const reposToFetch = [];

    repos.forEach((repo) => {
      const cached = readmeCache[repo.name];
      if (cached?.preview && isReadmeCacheFresh(cached?.cachedAt)) {
        cachedPreviews[repo.id] = cached.preview;
      } else {
        reposToFetch.push(repo);
      }
    });

    setReadmePreviews((current) => ({
      ...current,
      ...cachedPreviews,
    }));
    setReadmeLoadingMap(
      Object.fromEntries(repos.map((repo) => [repo.id, reposToFetch.some((item) => item.id === repo.id)])),
    );

    async function loadReadmePreviews() {
      if (!reposToFetch.length) {
        setReadmeLoadingMap(Object.fromEntries(repos.map((repo) => [repo.id, false])));
        return;
      }

      const fetchedPreviews = {};
      const updatedCache = { ...readmeCache };

      for (const repo of reposToFetch) {
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
            continue;
          }

          const markdown = await response.text();
          const preview = extractReadmePreview(markdown);

          if (preview) {
            fetchedPreviews[repo.id] = preview;
            updatedCache[repo.name] = {
              preview,
              cachedAt: Date.now(),
            };
          }
        } catch {
          // skip repositories without README or fetch errors
        }
      }

      if (!isMounted) {
        return;
      }

      setReadmePreviews((current) => ({
        ...current,
        ...fetchedPreviews,
      }));
      writeReadmeCache(updatedCache);
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

        <div className="github-shell">
          <ProfileSidebar
            t={t}
            productCount={localizedProducts.length}
            repoCount={reposWithReadme.length}
          />

          <section className="main-feed">
            <HeroSection t={t} />
            <ProductsSection t={t} products={localizedProducts} />
            <ProjectsSection
              t={t}
              repos={reposWithReadme}
              repoState={repoState}
              readmePreviews={readmePreviews}
              readmeLoadingMap={readmeLoadingMap}
              readmeLoading={isReadmeLoading}
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
