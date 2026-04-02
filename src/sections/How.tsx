import { useTranslation } from 'react-i18next';
import Reveal from '../components/Reveal';
import './How.css';

export default function How() {
  const { t } = useTranslation();
  const steps = t('how.steps', { returnObjects: true }) as Array<{
    icon: string;
    title: string;
    desc: string;
  }>;

  return (
    <section id="how">
      <Reveal>
        <div className="section-label">{t('how.label')}</div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="how-steps">
          {steps.map((step, i) => (
            <div className="how-step" key={i}>
              <div className="step-icon">{step.icon}</div>
              <div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
