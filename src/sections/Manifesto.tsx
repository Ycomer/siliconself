import { useTranslation } from 'react-i18next';
import Reveal from '../components/Reveal';
import './Manifesto.css';

export default function Manifesto() {
  const { t } = useTranslation();

  return (
    <div className="manifesto" id="manifesto">
      <Reveal>
        <div className="section-label">{t('manifesto.label')}</div>
      </Reveal>
      <Reveal delay={0.15}>
        <div className="manifesto-text">
          <span className="highlight">{t('manifesto.p1')}</span>
          <span className="manifesto-break" />
          {t('manifesto.p2')}
          <span className="manifesto-break" />
          {t('manifesto.p3_1')}<span className="accent">{t('manifesto.p3_em')}</span>{t('manifesto.p3_2')}
          <span className="manifesto-break" />
          {t('manifesto.p4_1')}<span className="highlight">{t('manifesto.p4_em')}</span>{t('manifesto.p4_2')}
          <span className="manifesto-break" />
          <span className="highlight">{t('manifesto.p5')}</span>
        </div>
      </Reveal>
    </div>
  );
}
