import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../utils/analytics';
import './Subscribe.css';

// 部署后替换为你的 Cloudflare Worker URL
const API_URL = import.meta.env.PROD
  ? ''
  : 'http://localhost:8787';

export default function Subscribe() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    trackEvent('subscribe_attempt', 'conversion', 'email');

    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'website' }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setEmail('');
        trackEvent('subscribe_success', 'conversion', 'email');
      } else {
        setStatus('error');
        trackEvent('subscribe_error', 'conversion', data.error || 'unknown');
      }
    } catch {
      setStatus('error');
      trackEvent('subscribe_error', 'conversion', 'network');
    }
  };

  return (
    <form className="subscribe-form" onSubmit={handleSubmit}>
      <div className="subscribe-input-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('subscribe.placeholder')}
          required
          disabled={status === 'loading' || status === 'success'}
          className="subscribe-input"
        />
        <button
          type="submit"
          className="subscribe-btn"
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? '...' : status === 'success' ? '✓' : t('subscribe.btn')}
        </button>
      </div>
      {status === 'success' && (
        <p className="subscribe-msg success">{t('subscribe.success')}</p>
      )}
      {status === 'error' && (
        <p className="subscribe-msg error">{t('subscribe.error')}</p>
      )}
    </form>
  );
}
