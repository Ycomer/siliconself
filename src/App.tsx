import SEOHead from './components/SEOHead';
import LangSwitch from './components/LangSwitch';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Why from './sections/Why';
import Who from './sections/Who';
import Zen from './sections/Zen';
import How from './sections/How';
import Vision from './sections/Vision';
import CTA from './sections/CTA';
import Footer from './sections/Footer';

export default function App() {
  return (
    <>
      <SEOHead />
      <LangSwitch />
      <Hero />
      <Manifesto />
      <Why />
      <Who />
      <Zen />
      <How />
      <Vision />
      <CTA />
      <Footer />
    </>
  );
}
