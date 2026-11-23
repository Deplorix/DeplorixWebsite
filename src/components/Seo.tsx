import { useEffect } from "react";

type JsonLd = Record<string, unknown>;

type Props = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: JsonLd[];
};

const DEFAULT_IMAGE = "https://deplorixtechnologies.site/og-image.jpg";
const DEFAULT_IMAGE_ALT = "DeploriX Technologies — Software, AI & Web Development Company in Bangalore";

const setMeta = (selector: string, attr: string, value: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
};

const REQUIRED_FIELDS: Record<string, string[]> = {
  Organization: ["name", "url"],
  Service: ["name", "provider", "areaServed"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  WebPage: ["name", "url"],
  AboutPage: ["name", "url"],
  ContactPage: ["name", "url"],
};

/** Dev-only sanity check so malformed structured data shows up in the console. */
const validateJsonLd = (blocks: JsonLd[]) => {
  if (!import.meta.env.DEV) return;
  blocks.forEach((block, i) => {
    const type = String(block["@type"] ?? "");
    const warn = (msg: string) => console.warn(`[schema.org] block #${i} (${type || "unknown"}): ${msg}`);
    if (!block["@context"]) warn("missing @context");
    if (!type) warn("missing @type");
    (REQUIRED_FIELDS[type] ?? []).forEach((field) => {
      if (block[field] === undefined) warn(`missing required property "${field}"`);
    });
  });
};

const Seo = ({
  title,
  description,
  canonical,
  keywords,
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
  type = "website",
  noindex = false,
  jsonLd = [],
}: Props) => {
  useEffect(() => {
    const prevTitle = document.title;
    const previousMeta = new Map<Element, string | null>();
    const rememberMeta = (selector: string, attr: string, value: string, content: string) => {
      const existing = document.head.querySelector<HTMLMetaElement>(selector);
      if (existing) previousMeta.set(existing, existing.getAttribute("content"));
      const element = setMeta(selector, attr, value, content);
      if (!existing) previousMeta.set(element, null);
    };

    document.title = title;

    // Primary Meta Tags
    rememberMeta('meta[name="description"]', "name", "description", description);
    if (keywords) {
      rememberMeta('meta[name="keywords"]', "name", "keywords", keywords);
    }
    rememberMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // Open Graph / Facebook
    rememberMeta('meta[property="og:title"]', "property", "og:title", title);
    rememberMeta('meta[property="og:description"]', "property", "og:description", description);
    rememberMeta('meta[property="og:url"]', "property", "og:url", canonical);
    rememberMeta('meta[property="og:type"]', "property", "og:type", type);
    rememberMeta('meta[property="og:image"]', "property", "og:image", image);
    rememberMeta('meta[property="og:image:alt"]', "property", "og:image:alt", imageAlt);
    rememberMeta('meta[property="og:site_name"]', "property", "og:site_name", "DeploriX Technologies");
    rememberMeta('meta[property="og:locale"]', "property", "og:locale", "en_IN");

    // Twitter / X
    rememberMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    rememberMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    rememberMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    rememberMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    rememberMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", imageAlt);

    // Canonical link
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousCanonical = link?.getAttribute("href") ?? null;
    const createdCanonical = !link;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    return () => {
      document.title = prevTitle;
      previousMeta.forEach((content, element) => {
        if (content === null) element.remove();
        else element.setAttribute("content", content);
      });
      if (createdCanonical) link?.remove();
      else if (previousCanonical) link!.href = previousCanonical;
    };
  }, [title, description, canonical, keywords, image, imageAlt, type, noindex]);

  useEffect(() => {
    if (!jsonLd.length) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seoRoute = "true";
    script.textContent = JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd);
    document.head.appendChild(script);
    validateJsonLd(jsonLd);
    return () => {
      script.remove();
    };
  }, [jsonLd]);

  return null;
};

export default Seo;
