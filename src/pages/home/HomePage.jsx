import MarqueeBar from "../../components/MarqueeBar";
import HeroSection from "./HeroSection";
import WorkSection from "./WorkSection";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";

// The marketing landing page (the original single-page experience), now a
// route rendered inside the public Layout.
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <WorkSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
