import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './TallyEmbed.css';

const TALLY_URLS = {
  zh: 'https://tally.so/embed/MeJjjY?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
  en: 'https://tally.so/embed/rjdbgN?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
};

export default function TallyEmbed() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const [loadedLang, setLoadedLang] = useState<Record<string, boolean>>({});
  const zhIframeRef = useRef<HTMLIFrameElement>(null);
  const enIframeRef = useRef<HTMLIFrameElement>(null);

  // 预加载两个 iframe，通过显示/隐藏切换
  useEffect(() => {
    // 加载 Tally 脚本
    if (!document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleLoad = (lang: 'zh' | 'en') => {
    setLoadedLang(prev => ({ ...prev, [lang]: true }));
  };

  return (
    <div className="tally-embed">
      {/* 中文表单 */}
      <iframe
        ref={zhIframeRef}
        src={TALLY_URLS.zh}
        className={`tally-iframe ${currentLang === 'zh' ? 'active' : ''} ${loadedLang.zh ? 'loaded' : ''}`}
        title="Silicon Self Form (Chinese)"
        onLoad={() => handleLoad('zh')}
      />
      {/* 英文表单 */}
      <iframe
        ref={enIframeRef}
        src={TALLY_URLS.en}
        className={`tally-iframe ${currentLang === 'en' ? 'active' : ''} ${loadedLang.en ? 'loaded' : ''}`}
        title="Silicon Self Form (English)"
        onLoad={() => handleLoad('en')}
      />
      {/* 加载指示器 */}
      {!loadedLang[currentLang] && (
        <div className="tally-loading">
          <span className="tally-spinner" />
        </div>
      )}
    </div>
  );
}
