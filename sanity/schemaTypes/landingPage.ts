import { defineArrayMember, defineField, defineType } from "sanity";

const shortText = (name: string, title: string) => defineField({ name, title, type: "string" });
const copy = (name: string, title: string) => defineField({ name, title, type: "text", rows: 3 });
const itemList = (name: string, title: string) => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "object", fields: [shortText("title", "Title"), copy("text", "Text")] })] });

export default defineType({
  name: "landingPage",
  title: "Landing page",
  type: "document",
  fields: [
    defineField({ name: "language", title: "Language", type: "string", validation: (rule) => rule.required().custom((value) => ["de", "en", "sk", "fr", "hr", "pl", "it", "es", "sv"].includes(value || "") ? true : "Use one of the supported locale codes.") }),
    shortText("title", "SEO title"), shortText("tagline", "Tagline"), shortText("cta", "Header CTA"),
    defineField({ name: "nav", title: "Navigation", type: "object", fields: [shortText("home", "Home"), shortText("services", "Services"), shortText("portfolio", "Portfolio"), shortText("about", "About"), shortText("process", "Process"), shortText("contact", "Contact")] }),
    shortText("heroEyebrow", "Hero eyebrow"), shortText("heroTitle", "Hero title"), shortText("heroAccent", "Hero accent"), copy("heroDescription", "Hero description"), shortText("heroPrimary", "Primary CTA"), shortText("heroSecondary", "Secondary CTA"), defineField({ name: "benefits", title: "Benefits", type: "array", of: [defineArrayMember({ type: "string" })] }),
    shortText("servicesEyebrow", "Services eyebrow"), shortText("servicesTitle", "Services title"), shortText("servicesAccent", "Services accent"), itemList("services", "Services"),
    shortText("aboutEyebrow", "About eyebrow"), shortText("aboutTitle", "About title"), shortText("aboutAccent", "About accent"), copy("aboutDescription", "About description"), shortText("aboutLink", "About link"), itemList("aboutBenefits", "About benefits"),
    shortText("portfolioEyebrow", "Portfolio eyebrow"), shortText("portfolioTitle", "Portfolio title"), shortText("portfolioAccent", "Portfolio accent"), shortText("portfolioLink", "Portfolio link"),
    shortText("processEyebrow", "Process eyebrow"), shortText("processTitle", "Process title"), shortText("processAccent", "Process accent"), copy("processDescription", "Process description"), itemList("process", "Process steps"),
    shortText("workspaceEyebrow", "Workspace eyebrow"), shortText("workspaceTitle", "Workspace title"), shortText("workspaceAccent", "Workspace accent"), shortText("workspaceCta", "Workspace CTA"),
    shortText("contactEyebrow", "Contact eyebrow"), shortText("contactTitle", "Contact title"), shortText("contactAccent", "Contact accent"), copy("contactDescription", "Contact description"), shortText("contactEmailLabel", "Email label"), shortText("contactPhoneLabel", "Phone label"), shortText("availability", "Availability"), shortText("footerSkip", "Footer navigation title"), shortText("footerContact", "Footer contact title"), copy("footerNote", "Footer note")
  ],
  preview: { select: { title: "title", language: "language" }, prepare({ title, language }) { return { title: title || "Landing page", subtitle: language?.toUpperCase() || "Locale" }; } }
});
