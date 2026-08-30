import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.foxprof.club",
  output: "static",
  build: { format: "directory" },
});
