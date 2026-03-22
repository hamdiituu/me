import { localeOptions } from "../data/content";

const REPO_CACHE_KEY = "repo_cache_v1";
const REPO_CACHE_TTL_MS = 1000 * 60 * 30;

export function formatDate(value, locale) {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }
}

export function sortRepos(data) {
  return [...data]
    .filter((repo) => !repo.fork && !repo.private)
    .sort((left, right) => {
      if (right.stargazers_count !== left.stargazers_count) {
        return right.stargazers_count - left.stargazers_count;
      }
      return new Date(right.updated_at) - new Date(left.updated_at);
    });
}

export function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "tr";
  }

  const savedLanguage = window.localStorage.getItem("language");
  if (localeOptions.some((item) => item.code === savedLanguage)) {
    return savedLanguage;
  }

  return "tr";
}

function isFresh(cachedAt, ttlMs) {
  if (!cachedAt) {
    return false;
  }

  return Date.now() - Number(cachedAt) < ttlMs;
}

export function readRepoCache({ allowStale = false } = {}) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(REPO_CACHE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.repos)) {
      return [];
    }

    if (!allowStale && !isFresh(parsed?.cachedAt, REPO_CACHE_TTL_MS)) {
      return [];
    }

    return parsed.repos;
  } catch {
    return [];
  }
}

export function writeRepoCache(repos) {
  if (typeof window === "undefined" || !Array.isArray(repos)) {
    return;
  }

  try {
    window.localStorage.setItem(
      REPO_CACHE_KEY,
      JSON.stringify({
        repos,
        cachedAt: Date.now(),
      }),
    );
  } catch {
    // ignore storage errors
  }
}
