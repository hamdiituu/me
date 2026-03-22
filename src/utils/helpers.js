import { localeOptions } from "../data/content";

const REPO_CACHE_KEY = "repo_cache_v1";
const README_CACHE_KEY = "readme_cache_v1";
const REPO_CACHE_TTL_MS = 1000 * 60 * 30;
const README_CACHE_TTL_MS = 1000 * 60 * 60 * 24;

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
    })
    .slice(0, 6);
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

export function extractReadmePreview(markdown, maxLength = 210) {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, " ");
  const withoutInlineCode = withoutCodeBlocks.replace(/`([^`]+)`/g, "$1");
  const withoutImages = withoutInlineCode.replace(/!\[[^\]]*]\([^)]*\)/g, " ");
  const withoutLinks = withoutImages.replace(/\[([^\]]+)]\([^)]*\)/g, "$1");
  const withoutHtml = withoutLinks.replace(/<[^>]+>/g, " ");
  const withoutHeadings = withoutHtml.replace(/^#+\s+/gm, "");
  const normalized = withoutHeadings.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trim()}...`;
}

function isFresh(cachedAt, ttlMs) {
  if (!cachedAt) {
    return false;
  }

  return Date.now() - Number(cachedAt) < ttlMs;
}

export function readRepoCache() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(REPO_CACHE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.repos) || !isFresh(parsed?.cachedAt, REPO_CACHE_TTL_MS)) {
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

export function readReadmeCache() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(README_CACHE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

export function writeReadmeCache(cache) {
  if (typeof window === "undefined" || !cache || typeof cache !== "object") {
    return;
  }

  try {
    window.localStorage.setItem(README_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore storage errors
  }
}

export function isReadmeCacheFresh(cachedAt) {
  return isFresh(cachedAt, README_CACHE_TTL_MS);
}
