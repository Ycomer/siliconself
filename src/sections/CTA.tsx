import { useTranslation } from 'react-i18next';
import { trackCTAClick } from '../utils/analytics';
import Reveal from '../components/Reveal';
import './CTA.css';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <div className="cta">
      <Reveal>
        <h2>
          {t('cta.title_1')}<br />{t('cta.title_2')}
        </h2>
        <p>
          {t('cta.desc_1')}<br />{t('cta.desc_2')}
        </p>
        <a
          href="https://x.com/FankusAI"
          className="cta-btn"
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackCTAClick}
        >
          {t('cta.btn')}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </a>
      </Reveal>
    </div>
  );
}
