import { useTranslation } from 'react-i18next';
import './Hero.css';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const zh = i18n.language.startsWith('zh');

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
      <div className="hero-actions"><a className="cta-btn cta-btn-primary" href="#experiment">{zh ? '开始 7 天自助实验 →' : 'Start a seven-day experiment →'}</a><a href="#join">{zh ? '申请陪伴内测' : 'Join the guided pilot'}</a></div>
      <div className="scroll-hint">
        <span>{t('hero.scroll')}</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
