                                                                                                                                  import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MainContent from './components/MainContent';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MainContent />
      </main>
    </>
  );                            
}
