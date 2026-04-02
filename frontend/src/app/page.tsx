import { Header } from "@/components/civiq/Header";
import { Hero } from "@/components/civiq/Hero";
import { HowItWorks } from "@/components/civiq/HowItWorks";
import { PolicyBriefingPanel } from "@/components/civiq/PolicyBriefingPanel";
import { NeighborhoodInsights } from "@/components/civiq/NeighborhoodInsights";
import { MapPanel } from "@/components/civiq/MapPanel";
import { RecentUpdates } from "@/components/civiq/RecentUpdates";
import { SiteFooter } from "@/components/civiq/SiteFooter";
import { ParallaxBackdrop } from "@/components/civiq/ParallaxBackdrop";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <ParallaxBackdrop />
      <Header />
      <main className="relative z-10 flex-1">
        <Hero />
        <HowItWorks />
        <PolicyBriefingPanel />
        <NeighborhoodInsights />
        <MapPanel />
        <RecentUpdates />
      </main>
      <SiteFooter />
    </div>
  );
}
