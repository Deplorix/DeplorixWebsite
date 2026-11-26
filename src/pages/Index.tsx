import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DeferredSection from "@/components/DeferredSection";
import Seo from "@/components/Seo";
import WhatsAppButton from "@/components/WhatsAppButton";

const AboutSection = lazy(() => import("@/components/AboutSection"));
const ServicesSection = lazy(() => import("@/components/ServicesSection"));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const WorkflowSection = lazy(() => import("@/components/WorkflowSection"));
const FYPSection = lazy(() => import("@/components/FYPSection"));
const InternshipSection = lazy(() => import("@/components/InternshipSection"));
const UpcomingProjectsSection = lazy(() => import("@/components/UpcomingProjectsSection"));
const ProjectAdvisor = lazy(() => import("@/components/ProjectAdvisor"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));
const StickyContactBar = lazy(() => import("@/components/StickyContactBar"));

const PAGE_SEO: Record<
  string,
  {
    title: string;
    description: string;
    canonical: string;
    keywords: string;
    jsonLd: Record<string, unknown>[];
  }
> = {
  "/": {
    title: "Deplorix – AI Solutions, Innovation & Technology | Software & Web Studio Bangalore",
    description:
      "DeploriX Technologies — Bangalore's leading software, AI, web and app development company for custom websites, mobile apps, digital growth, internships and final-year projects.",
    canonical: "https://deplorixtechnologies.site/",
    keywords:
      "Deplorix, AI Solutions, Software Development Company Bangalore, Web Development Bangalore, Mobile Apps, IT Startup, Final Year Projects, Software Internship",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "DeploriX Technologies",
        url: "https://deplorixtechnologies.site/",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://deplorixtechnologies.site/?s={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  },
  "/about": {
    title: "About Deplorix – Our Vision, Team & Technology | Software Studio",
    description:
      "Learn about DeploriX Technologies — our vision, core values, leadership team, and our commitment to building dependable, scalable software and AI solutions in Bangalore.",
    canonical: "https://deplorixtechnologies.site/about",
    keywords:
      "About Deplorix, DeploriX Team, Software Company Bangalore, Engineering Culture, Tech Vision, Startup Studio Bangalore, Leadership",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About DeploriX Technologies",
        url: "https://deplorixtechnologies.site/about",
        description: "Bangalore-based product studio turning bold ideas into software and AI products that ship.",
        mainEntity: {
          "@type": "Organization",
          name: "DeploriX Technologies",
          url: "https://deplorixtechnologies.site/",
          foundingDate: "2024",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bangalore",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
          { "@type": "ListItem", position: 2, name: "About", item: "https://deplorixtechnologies.site/about" },
        ],
      },
    ],
  },
  "/services": {
    title: "AI & Software Development Services – Deplorix | Web, Apps & Cloud",
    description:
      "Explore DeploriX's core development services: custom websites, mobile applications, AI systems, SaaS engineering, UI/UX design, and digital marketing.",
    canonical: "https://deplorixtechnologies.site/services",
    keywords:
      "AI Development Services, Web Development Services, Mobile App Development, UI UX Design, Custom Software Development Bangalore, SaaS Engineering, Digital Marketing Services",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Software & AI Development Services",
        provider: { "@type": "Organization", name: "DeploriX Technologies", url: "https://deplorixtechnologies.site/" },
        areaServed: { "@type": "Place", name: "Worldwide" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "DeploriX Core Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web & App Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Artificial Intelligence & Automation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX & Product Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Marketing & Growth" } },
          ],
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://deplorixtechnologies.site/services" },
        ],
      },
    ],
  },
  "/products": {
    title: "Innovative AI Products & Solutions – Deplorix | Real Case Studies",
    description:
      "Discover DeploriX's software and AI products, client case studies, and scalable digital solutions shipped for startups, enterprises, and academic teams.",
    canonical: "https://deplorixtechnologies.site/products",
    keywords:
      "AI Products, Software Solutions, Deplorix Case Studies, FinFlow Dashboard, HealthTrack Mobile, ShopEase Commerce, SaaS Solutions Bangalore",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Innovative AI Products & Solutions by DeploriX",
        url: "https://deplorixtechnologies.site/products",
        description: "Selected software and AI products engineered and shipped by DeploriX Technologies.",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
          { "@type": "ListItem", position: 2, name: "Products", item: "https://deplorixtechnologies.site/products" },
        ],
      },
    ],
  },
  "/contact": {
    title: "Contact Deplorix – Let's Build Something Together | Free Scoping Call",
    description:
      "Get in touch with DeploriX Technologies. Share your product requirements, request an estimate, or discuss your next website, app, or AI project.",
    canonical: "https://deplorixtechnologies.site/contact",
    keywords:
      "Contact Deplorix, Hire Software Developers Bangalore, Web Development Quote, Free Scoping Call, Software Consultation, Hire AI Developers",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact DeploriX Technologies",
        url: "https://deplorixtechnologies.site/contact",
        mainEntity: {
          "@type": "LocalBusiness",
          name: "DeploriX Technologies",
          telephone: "+91 99458 31090",
          email: "deplorixtechnologies@gmail.com",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bangalore",
            addressRegion: "Karnataka",
            addressCountry: "IN",
          },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
          { "@type": "ListItem", position: 2, name: "Contact", item: "https://deplorixtechnologies.site/contact" },
        ],
      },
    ],
  },
  "/internship": {
    title: "Software Engineering Internships – Deplorix | Real Product Squads",
    description:
      "Apply for industry-ready engineering internships at DeploriX Technologies. Work on live products, get senior mentorship, and build verifiable proof for your tech career.",
    canonical: "https://deplorixtechnologies.site/internship",
    keywords:
      "Software Internship, Deplorix Internship, Web Development Internship, Full Stack Internship, Java Internship, Python Data Science Internship, Bangalore Tech Internship",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalProgram",
        name: "DeploriX Industry-Ready Engineering Internship",
        description: "Hands-on engineering internship working in live product squads across full-stack web, backend, data science, cloud, and UI/UX.",
        provider: {
          "@type": "Organization",
          name: "DeploriX Technologies",
          url: "https://deplorixtechnologies.site/",
        },
        timeToComplete: "P3M",
        educationalProgramMode: "hybrid",
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
          { "@type": "ListItem", position: 2, name: "Internship", item: "https://deplorixtechnologies.site/internship" },
        ],
      },
    ],
  },
  "/internships": {
    title: "Software Engineering Internships – Deplorix | Real Product Squads",
    description:
      "Apply for industry-ready engineering internships at DeploriX Technologies. Work on live products, get senior mentorship, and build verifiable proof for your tech career.",
    canonical: "https://deplorixtechnologies.site/internship",
    keywords:
      "Software Internship, Deplorix Internship, Web Development Internship, Full Stack Internship, Java Internship, Python Data Science Internship, Bangalore Tech Internship",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
          { "@type": "ListItem", position: 2, name: "Internships", item: "https://deplorixtechnologies.site/internship" },
        ],
      },
    ],
  },
  "/internship/apply": {
    title: "Apply for Internship – DeploriX Technologies | Student & Early-Career Enrollment",
    description:
      "Apply for the DeploriX 2026 Cohort Internship. Submit your academic background, preferred tech track, and portfolio to join our product squads.",
    canonical: "https://deplorixtechnologies.site/internship/apply",
    keywords:
      "Apply Internship Bangalore, Deplorix Internship Application, Software Internship Enrollment, Student Tech Internship Apply",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://deplorixtechnologies.site/" },
          { "@type": "ListItem", position: 2, name: "Internship", item: "https://deplorixtechnologies.site/internship" },
          { "@type": "ListItem", position: 3, name: "Apply", item: "https://deplorixtechnologies.site/internship/apply" },
        ],
      },
    ],
  },
};

const IdleEnhancements = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <StickyContactBar />
    </Suspense>
  );
};

const Index = () => {
  const location = useLocation();
  const seoConfig = PAGE_SEO[location.pathname] || PAGE_SEO["/"];

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={seoConfig.title}
        description={seoConfig.description}
        canonical={seoConfig.canonical}
        keywords={seoConfig.keywords}
        jsonLd={seoConfig.jsonLd}
      />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <DeferredSection sectionId="solutions" minHeight="1000px" tabletMinHeight="1650px" mobileMinHeight="2040px" rootMargin="100px 0px"><AboutSection /></DeferredSection>
        <DeferredSection sectionId="products" minHeight="1050px" tabletMinHeight="1650px" mobileMinHeight="2090px"><ServicesSection /></DeferredSection>
        <DeferredSection sectionId="pricing" minHeight="1450px" tabletMinHeight="2250px" mobileMinHeight="2820px"><ProjectsSection /></DeferredSection>
        <DeferredSection sectionId="process" minHeight="760px" tabletMinHeight="1250px" mobileMinHeight="1580px"><WorkflowSection /></DeferredSection>
        <DeferredSection sectionId="fyp" minHeight="980px" tabletMinHeight="1180px" mobileMinHeight="1730px"><FYPSection /></DeferredSection>
        <DeferredSection sectionId="internship" minHeight="1050px" tabletMinHeight="1320px" mobileMinHeight="1460px"><InternshipSection /></DeferredSection>
        <DeferredSection sectionId="upcoming" minHeight="1100px" tabletMinHeight="1450px" mobileMinHeight="1640px"><UpcomingProjectsSection /></DeferredSection>
        <DeferredSection sectionId="advisor" minHeight="1050px" tabletMinHeight="1320px" mobileMinHeight="1460px"><ProjectAdvisor /></DeferredSection>
        <DeferredSection sectionId="contact" minHeight="1200px" tabletMinHeight="1650px" mobileMinHeight="1970px"><ContactSection /></DeferredSection>
      </main>
      <DeferredSection minHeight="420px" rootMargin="900px 0px"><Footer /></DeferredSection>
      <WhatsAppButton />
      <IdleEnhancements />
    </div>
  );
};

export default Index;
