import { useTranslation } from 'react-i18next';
import Reveal from '../components/Reveal';
import './Zen.css';

export default function Zen() {
  const { t } = useTranslation();

  return (
    <div className="zen">
      <Reveal>
        <p className="zen-quote">
          {t('zen.line1')}<br />
          {t('zen.line2')}
        </p>
        <p className="zen-source">{t('zen.source')}</p>
      </Reveal>
    </div>
  );
}
