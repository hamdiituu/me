import { localeOptions } from "../data/content";

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
    .filter((repo) => !repo.fork)
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
