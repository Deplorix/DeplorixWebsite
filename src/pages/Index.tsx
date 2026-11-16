import { lazy, Suspense, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DeferredSection from "@/components/DeferredSection";
import Seo from "@/components/Seo";

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
const WhatsAppButton = lazy(() => import("@/components/WhatsAppButton"));

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
      <WhatsAppButton />
    </Suspense>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="DeploriX Technologies | #1 Software, AI & Web Development Company in Bangalore"
        description="DeploriX Technologies — Bangalore's leading software, AI, web and app development company for websites, mobile apps, digital growth, internships and final-year projects."
        canonical="https://deplorixtechnologies.site/"
      />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <DeferredSection sectionId="solutions" minHeight="1000px" tabletMinHeight="1650px" mobileMinHeight="2040px" rootMargin="100px 0px"><AboutSection /></DeferredSection>
        <DeferredSection sectionId="products" minHeight="1050px" tabletMinHeight="1650px" mobileMinHeight="2090px"><ServicesSection /></DeferredSection>
        <DeferredSection sectionId="pricing" minHeight="1450px" tabletMinHeight="2250px" mobileMinHeight="2820px"><ProjectsSection /></DeferredSection>
        <DeferredSection sectionId="process" minHeight="760px" tabletMinHeight="1250px" mobileMinHeight="1580px"><WorkflowSection /></DeferredSection>
        <DeferredSection sectionId="fyp" minHeight="980px" tabletMinHeight="1180px" mobileMinHeight="1320px"><FYPSection /></DeferredSection>
        <DeferredSection sectionId="resources" minHeight="1050px" tabletMinHeight="1320px" mobileMinHeight="1460px"><InternshipSection /></DeferredSection>
        <DeferredSection sectionId="upcoming" minHeight="1100px" tabletMinHeight="1450px" mobileMinHeight="1640px"><UpcomingProjectsSection /></DeferredSection>
        <DeferredSection sectionId="advisor" minHeight="1050px" tabletMinHeight="1320px" mobileMinHeight="1460px"><ProjectAdvisor /></DeferredSection>
        <DeferredSection sectionId="contact" minHeight="1200px" tabletMinHeight="1650px" mobileMinHeight="1970px"><ContactSection /></DeferredSection>
      </main>
      <DeferredSection minHeight="420px" rootMargin="900px 0px"><Footer /></DeferredSection>
      <IdleEnhancements />
    </div>
  );
};

export default Index;
