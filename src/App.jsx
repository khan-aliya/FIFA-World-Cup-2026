// src/App.jsx
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import HeroScene from "./components/HeroScene";
import LiveScoreWidget from "./components/LiveScoreWidget";
import FixturesSection from "./components/FixturesSection";
import StandingsSection from "./components/StandingsSection";
import KnockoutSection from "./components/KnockoutSection";
import TopScorersSection from "./components/TopScorersSection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <ThemeProvider>
      {/* Skip link — first focusable element for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <HeroScene />
        <FixturesSection />
        <StandingsSection />
        <KnockoutSection />
        <TopScorersSection />
      </main>

      <Footer />
      <LiveScoreWidget />
    </ThemeProvider>
  );
}
