import { useTranslation } from 'react-i18next';
import Reveal from '../components/Reveal';
import './Why.css';

interface WhyCard {
  num: string;
  title: string;
  desc: string;
}

export default function Why() {
  const { t } = useTranslation();
  const cards = t('why.cards', { returnObjects: true }) as WhyCard[];

  return (
    <section id="why">
      <Reveal>
        <div className="section-label">{t('why.label')}</div>
      </Reveal>
      <div className="why-grid">
        {cards.map((card, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="why-card">
              <div className="why-number">{card.num}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
