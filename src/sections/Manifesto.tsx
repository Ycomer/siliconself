import { useTranslation } from 'react-i18next';
import Reveal from '../components/Reveal';
import './Manifesto.css';

interface ManifestoBlock {
  type: 'text' | 'highlight';
  content: string;
}

export default function Manifesto() {
  const { t } = useTranslation();
  const blocks = t('manifesto.blocks', { returnObjects: true }) as ManifestoBlock[];

  return (
    <div className="manifesto" id="manifesto">
      <Reveal>
        <div className="section-label">{t('manifesto.label')}</div>
      </Reveal>
      <div className="manifesto-text">
        {blocks.map((block, i) => (
          <Reveal key={i} delay={0.1 + i * 0.08}>
            {block.type === 'highlight' ? (
              <p className="manifesto-highlight">{block.content}</p>
            ) : (
              <p className="manifesto-paragraph">{block.content}</p>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  );
}
