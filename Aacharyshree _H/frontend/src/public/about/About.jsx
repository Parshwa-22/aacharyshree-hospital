import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Accessibility from "../../shared/components/accessibility/AccessibilityButton";
import VidyasanmatidasTrustPage from "./VidyasanmatidasTrustPage";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="pt-0">
        <VidyasanmatidasTrustPage />
        <Accessibility />
      </main>

      <Footer />
    </>
  );
}
