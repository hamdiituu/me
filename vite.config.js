import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repository = process.env.GITHUB_REPOSITORY || "";
const defaultBase = repository === "hamdiituu/me" ? "/me/" : "/";
const base = process.env.VITE_BASE_PATH || defaultBase;

export default defineConfig({
  plugins: [react()],
  base,
});
