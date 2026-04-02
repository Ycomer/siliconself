import { useTranslation } from 'react-i18next';
import Reveal from '../components/Reveal';
import './Vision.css';

export default function Vision() {
  const { t } = useTranslation();
  const stages = t('vision.stages', { returnObjects: true }) as Array<{
    phase: string;
    title: string;
    desc: string;
  }>;

  return (
    <section className="vision" id="vision">
      <Reveal>
        <div className="section-label">{t('vision.label')}</div>
      </Reveal>
      <div className="vision-stages">
        {stages.map((stage, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <div className={`vision-stage${i === 0 ? ' active' : ''}`}>
              <div className="stage-label">{stage.phase}</div>
              <h3>{stage.title}</h3>
              <p>{stage.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
