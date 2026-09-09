import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="footer-tagline">{t('footer.tagline')}</div>
      <a className="footer-logo" href="https://fankus.me">{t('footer.text')}</a>
    </footer>
  );
}
