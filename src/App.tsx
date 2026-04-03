import SEOHead from './components/SEOHead';
import LangSwitch from './components/LangSwitch';
import ThemeSwitch from './components/ThemeSwitch';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Why from './sections/Why';
import Zen from './sections/Zen';
import Vision from './sections/Vision';
import How from './sections/How';
import CTA from './sections/CTA';
import Footer from './sections/Footer';

export default function App() {
  return (
    <>
      <SEOHead />
      <ThemeSwitch />
      <LangSwitch />
      <Hero />
      <Manifesto />
      <Why />
      <Zen />
      <Vision />
      <How />
      <CTA />
      <Footer />
    </>
  );
}
