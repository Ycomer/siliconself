import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="footer-logo">{t('footer.text')}</div>
    </footer>
  );
}
