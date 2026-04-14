import { useTranslation } from 'react-i18next';
import Reveal from '../components/Reveal';
import './Who.css';

interface WhoGroup {
  title: string;
  desc: string;
}

export default function Who() {
  const { t } = useTranslation();
  const groups = t('who.groups', { returnObjects: true }) as WhoGroup[];

  return (
    <section id="who">
      <Reveal>
        <div className="section-label">{t('who.label')}</div>
      </Reveal>
      <div className="who-grid">
        {groups.map((group, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="who-card">
              <h3>{group.title}</h3>
              <p>{group.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
