import { useTranslation } from 'react-i18next';
import './Hero.css';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="mirror-container">
        <div className="mirror-frame">
          <div className="mirror-reflection" />
        </div>
        <div className="mirror-text">{t('hero.brand')}</div>
      </div>
      <h1 className="hero-title">
        {t('hero.title_1')}
        <br />
        <em>{t('hero.title_2')}</em>
      </h1>
      <p className="hero-subtitle">
        {t('hero.subtitle_1')}<br />{t('hero.subtitle_2')}
      </p>
      <div className="scroll-hint">
        <span>{t('hero.scroll')}</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
