import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import InfoSection from "../../components/about/InfoSection";
import ValuesSection from "../../components/about/ValuesSection";
import AboutContent from "../../components/about/AboutContent";
import TrustSection from "../../components/about/TrustSection";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="pt-0">
        <InfoSection />
        <TrustSection />
        <ValuesSection />
        <AboutContent />
        <Accessibility />
      </main>

      <Footer />
    </>
  );
}
