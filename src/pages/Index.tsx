import { lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import DeferredSection from "@/components/DeferredSection";

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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <DeferredSection minHeight="1050px"><ServicesSection /></DeferredSection>
        <DeferredSection minHeight="1450px"><ProjectsSection /></DeferredSection>
        <DeferredSection minHeight="760px"><WorkflowSection /></DeferredSection>
        <DeferredSection minHeight="980px"><FYPSection /></DeferredSection>
        <DeferredSection minHeight="1050px"><InternshipSection /></DeferredSection>
        <DeferredSection minHeight="1100px"><UpcomingProjectsSection /></DeferredSection>
        <DeferredSection minHeight="1050px"><ProjectAdvisor /></DeferredSection>
        <DeferredSection minHeight="1200px"><ContactSection /></DeferredSection>
      </main>
      <DeferredSection minHeight="420px" rootMargin="900px 0px"><Footer /></DeferredSection>
      <DeferredSection minHeight="0px" rootMargin="0px"><StickyContactBar /></DeferredSection>
      <DeferredSection minHeight="0px" rootMargin="0px"><WhatsAppButton /></DeferredSection>
    </div>
  );
};

export default Index;
