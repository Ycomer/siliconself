import { useTranslation } from 'react-i18next';
import { trackLangSwitch } from '../utils/analytics';
import './LangSwitch.css';

export default function LangSwitch() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const toggle = () => {
    const next = isZh ? 'en' : 'zh';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
    document.documentElement.lang = next;
    trackLangSwitch(next);
  };

  return (
    <button className="lang-switch" onClick={toggle} aria-label="Switch language">
      <span className={`lang-opt ${isZh ? 'active' : ''}`}>中</span>
      <span className="lang-divider">/</span>
      <span className={`lang-opt ${!isZh ? 'active' : ''}`}>EN</span>
    </button>
  );
}
