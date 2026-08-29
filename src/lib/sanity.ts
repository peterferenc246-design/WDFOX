import { createClient } from "@sanity/client";
import { getFallbackContent, type LandingContent, type Locale } from "../data/content";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2026-01-01";

const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

const landingQuery = `*[_type == "landingPage" && language == $language][0]{
  language, title, tagline, heroEyebrow, heroTitle, heroAccent, heroDescription,
  heroPrimary, heroSecondary, benefits, servicesEyebrow, servicesTitle, servicesAccent,
  services[]{title, text}, aboutEyebrow, aboutTitle, aboutAccent, aboutDescription,
  aboutLink, aboutBenefits[]{title, text}, portfolioEyebrow, portfolioTitle, portfolioAccent,
  portfolioLink, processEyebrow, processTitle, processAccent, processDescription,
  process[]{title, text}, workspaceEyebrow, workspaceTitle, workspaceAccent, workspaceCta,
  contactEyebrow, contactTitle, contactAccent, contactDescription, contactEmailLabel,
  contactPhoneLabel, availability, footerSkip, footerContact, footerNote,
  nav{home, services, portfolio, about, process, contact}, cta
}`;

export async function getLandingContent(locale: Locale): Promise<LandingContent> {
  const fallback = getFallbackContent(locale);
  if (!client) return fallback;

  try {
    const remote = await client.fetch<Partial<LandingContent> | null>(landingQuery, { language: locale });
    return remote ? mergeContent(fallback, remote) : fallback;
  } catch (error) {
    console.warn(`[sanity] Falling back to local ${locale} content`, error);
    return fallback;
  }
}

function mergeContent(fallback: LandingContent, remote: Partial<LandingContent>): LandingContent {
  return {
    ...fallback,
    ...remote,
    nav: { ...fallback.nav, ...(remote.nav || {}) },
    benefits: remote.benefits?.length ? remote.benefits : fallback.benefits,
    services: remote.services?.length ? remote.services : fallback.services,
    aboutBenefits: remote.aboutBenefits?.length ? remote.aboutBenefits : fallback.aboutBenefits,
    process: remote.process?.length ? remote.process : fallback.process,
  };
}
