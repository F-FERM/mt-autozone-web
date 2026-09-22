import HeroSection from "../component/hero/HeroSection";
import AboutMTZone from "../component/home/AboutMtZone";
import ServiceCards from "../component/home/ServiceCard";
import ServicesSection from "../component/home/Services";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <HeroSection />
      <AboutMTZone />
      <ServiceCards />
      <ServicesSection />
    </main>
  );
}
