import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LiveDarshan } from './components/LiveDarshan';
import { MelanMap } from './components/MelanMap';
import { Schedule } from './components/Schedule';
import { PassesAndDonation } from './components/PassesAndDonation';
import { HeritageStory } from './components/HeritageStory';
import { GalleryAndVR } from './components/GalleryAndVR';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { LiveStreamModal } from './components/LiveStreamModal';
import { FloatingNav } from './components/FloatingNav';

export function AppContent() {
  return (
    <div className="min-h-screen bg-[#FFFDF8] text-amber-950 flex flex-col font-sans selection:bg-[#FFD700] selection:text-black">
      <Header />
      <main className="flex-1">
        <Hero />
        <LiveDarshan />
        <MelanMap />
        <Schedule />
        <PassesAndDonation />
        <HeritageStory />
        <GalleryAndVR />
      </main>
      <Footer />
      <AdminModal />
      <LiveStreamModal />
      <FloatingNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
