import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function SEOHead() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const url = 'https://siliconself.xyz'; // Replace with actual domain

  return (
    <Helmet>
      <html lang={lang} />
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
      <meta name="keywords" content={t('meta.keywords')} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={t('meta.title')} />
      <meta property="og:description" content={t('meta.description')} />
      <meta property="og:image" content={`${url}/og-image.png`} />
      <meta property="og:locale" content={lang === 'zh' ? 'zh_CN' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@FankusAI" />
      <meta name="twitter:title" content={t('meta.title')} />
      <meta name="twitter:description" content={t('meta.description')} />
      <meta name="twitter:image" content={`${url}/og-image.png`} />

      {/* Alternate language */}
      <link rel="alternate" hrefLang="zh" href={`${url}?lang=zh`} />
      <link rel="alternate" hrefLang="en" href={`${url}?lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Canonical */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Silicon Self',
        url,
        description: t('meta.description'),
        author: {
          '@type': 'Person',
          name: 'Fankus',
          url: 'https://x.com/FankusAI',
        },
        inLanguage: [lang === 'zh' ? 'zh-CN' : 'en'],
      })}</script>
    </Helmet>
  );
}
