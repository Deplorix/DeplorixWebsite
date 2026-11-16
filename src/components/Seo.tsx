import { useEffect } from "react";

type JsonLd = Record<string, unknown>;

type Props = {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: JsonLd[];
};

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
  console.info(`[schema.org] validated ${blocks.length} block(s): no further warnings`);
};

const Seo = ({ title, description, canonical, jsonLd = [] }: Props) => {
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

    rememberMeta('meta[name="description"]', "name", "description", description);
    rememberMeta('meta[property="og:title"]', "property", "og:title", title);
    rememberMeta('meta[property="og:description"]', "property", "og:description", description);
    rememberMeta('meta[property="og:url"]', "property", "og:url", canonical);
    rememberMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    rememberMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

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
  }, [title, description, canonical]);

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
