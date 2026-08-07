import React from "react";
import Navbar from "../../components/home/Navbar";
import AccessibilityPanel from "../../shared/components/accessibility/AccessibilityButton";
import HeroSection from "../../components/home/HeroSection";
import DepartmentShowcase from "../../components/home/InfoSection/DepartmentShowcase";
import CountSection from "../../components/home/Stats";
import DoctorsSection from "../../components/home/Doctors";
import Testimonials from "../../components/home/Testimonials";
import Footer from "../../components/home/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <AccessibilityPanel />
      <div className="pt-0">
        <HeroSection />
      </div>
      <DepartmentShowcase />
      <CountSection />
      <DoctorsSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;
