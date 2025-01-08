import React from "react";
import UniversityHero from "../components/UniversityHero";
import Footer from "../components/Footer";
import SuccessMatters from "../components/SuccessMatters";
import FAQ from "../components/FAQ";
import UniversitySearch from "../components/UniversitySearch";
import StatsSection from "../components/StatsSection";

const Home = () => {
  return (
    <div>
      <UniversityHero />
      <UniversitySearch />
      <StatsSection />
      <SuccessMatters />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;
