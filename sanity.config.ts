import { defineConfig } from "sanity";
import { visionTool } from "@sanity/vision";
import landingPage from "./sanity/schemaTypes/landingPage";

export default defineConfig({
  name: "webdizainfox",
  title: "WebDizainFOX CMS",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "replace-me",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [visionTool()],
  schema: { types: [landingPage] },
});
