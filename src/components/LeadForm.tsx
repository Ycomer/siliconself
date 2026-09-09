import {useEffect, useRef, useState} from 'react';
import type {FormEvent} from 'react';
import './LeadForm.css';

type Props = {site: 'ycomer' | 'siliconself'; language?: string};
type Turnstile = {render: (element: HTMLElement, options: Record<string, unknown>) => string; reset: (id: string) => void; remove: (id: string) => void};
type LeadWindow = Window & {turnstile?: Turnstile; gtag?: (...args: unknown[]) => void};
export default function LeadForm({site, language = 'zh'}: Props) {
  const zh = language.startsWith('zh');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const token = useRef('');
  const started = useRef(false);
  const track = (name: string) => (window as LeadWindow).gtag?.('event', name, {site, form: 'lead'});
  useEffect(() => {
    let disposed = false;
    const render = () => {
      const api = (window as LeadWindow).turnstile;
      if (!disposed && api && widget.current && widgetId.current === undefined) {
        widgetId.current = api.render(widget.current, {
          sitekey: '0x4AAAAAAEOj6ZW0byLQcQUh', action: 'lead', theme: 'auto',
          language: zh ? 'zh-cn' : 'en', size: 'flexible',
          callback: (value: string) => {token.current = value; setReady(true);},
          'expired-callback': () => {token.current = ''; setReady(false);},
          'error-callback': () => {token.current = ''; setReady(false); setError(zh ? '验证加载失败，请刷新重试，或使用下方邮箱。' : 'Verification failed to load. Refresh or use the email below.');},
        });
        clearInterval(timer);
      }
    };
    if (!document.querySelector('script[data-lead-turnstile]')) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true; script.dataset.leadTurnstile = 'true';
      script.onerror = () => {if (!disposed) setError(zh ? '验证服务无法加载，请使用下方邮箱。' : 'Verification unavailable. Please use the email below.');};
      document.head.appendChild(script);
    }
    const timer = setInterval(render, 250); render();
    const timeout = setTimeout(() => {clearInterval(timer); if (!disposed && widgetId.current === undefined) setError(zh ? '验证服务无法加载，请使用下方邮箱。' : 'Verification unavailable. Please use the email below.');}, 15000);
    return () => {disposed = true; clearInterval(timer); clearTimeout(timeout); if (widgetId.current !== undefined) (window as LeadWindow).turnstile?.remove(widgetId.current); widgetId.current = undefined; token.current = '';};
  }, [zh]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || status === 'loading' || status === 'success') return;
    const form = new FormData(event.currentTarget);
    setStatus('loading'); setError('');
    const params = new URLSearchParams(window.location.search);
    try {
      const response = await fetch('https://speechact.xyz/api/leads', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          email: form.get('email'), interest: form.get('interest'),
          problem: form.get('problem'), website: form.get('website'),
          paid_interest: form.get('paid_interest') || '', consent: form.get('consent') === 'on',
          language: zh ? 'zh' : 'en', token: token.current,
          page: window.location.pathname,
          referrer: document.referrer ? new URL(document.referrer).origin : '',
          utm_source: params.get('utm_source'), utm_medium: params.get('utm_medium'), utm_campaign: params.get('utm_campaign'),
        }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || 'Submission failed');
      setStatus('success'); track('lead_submit');
    } catch (reason) {
      setStatus('error'); setError(reason instanceof Error ? reason.message : 'Please try again');
      token.current = ''; setReady(false);
      if (widgetId.current !== undefined) (window as LeadWindow).turnstile?.reset(widgetId.current);
      track('lead_error');
    }
  }
  return <div className={'lead-panel lead-' + site}>
    {status === 'success' ? <div role="status" className="lead-success">
      <span className="lead-kicker">{zh ? '申请已保存' : 'YOU ARE ON THE LIST'}</span>
      <h3>{zh ? '下一步，开始一个小实验。' : 'Your next step starts here.'}</h3>
      <p>{zh ? 'Fankus 会收到你的申请。后续将按你选择的兴趣联系你；这里不会自动扣费。' : 'Fankus will receive your request and follow up on your selected interest. There is no automatic charge.'}</p>
      <a className="lead-button" href={site === 'ycomer' ? '/field-guide' : '#experiment'}>{zh ? (site === 'ycomer' ? '打开 7 天产品验证清单 →' : '开始本地 7 天记录 →') : 'Start your local seven-day journal →'}</a>
      <p><a href="mailto:hello@siliconself.xyz">{zh ? '也可以直接写信给 Fankus' : 'Or write directly to Fankus'}</a></p>
    </div> : <form onSubmit={submit} onFocus={() => {if (!started.current) {started.current = true; track('lead_form_start');}}}>
      <label>{zh ? '你的邮箱' : 'Your email'}<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required /></label>
      <label>{zh ? '你最关心什么？' : 'What would you like to explore?'}
        <select name="interest" defaultValue="" required>
          <option value="" disabled>{zh ? '选择一个方向' : 'Choose a focus'}</option>
          {(site === 'ycomer' ? [['ai-products','AI 产品与独立开发'],['markets','投资思考与决策复盘'],['self-reflection','自我认知与反馈系统']] : [
            ['goals',zh ? '目标与行动之间的落差' : 'The gap between intention and action'],
            ['patterns',zh ? '反复出现的行为模式' : 'Recurring behavior patterns'],
            ['decisions',zh ? '更清晰地复盘决策' : 'Reflecting on decisions'],
          ]).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      {site === 'siliconself' && <label>{zh ? '你希望看清什么？（选填）' : 'What would you like to understand? (optional)'}<textarea name="problem" rows={3} maxLength={2000} placeholder={zh ? '只描述目标，不需要提交私人日记。' : 'Describe your goal, without sharing private journal entries.'}/></label>}
      <label className="lead-check"><input type="checkbox" name="paid_interest" value="interested"/><span>{zh ? '有合适的付费试点时，可以联系我（选填）' : 'Contact me about a relevant paid pilot (optional)'}</span></label>
      <label className="lead-check"><input type="checkbox" name="consent" required/><span>{zh ? '同意接收所选主题的邮件和申请跟进。可回复邮件退订；详情见' : 'I agree to emails about my selected topic and application. I can reply to unsubscribe. Read the '} <a href={site === 'ycomer' ? '/privacy' : '#privacy'}>{zh ? '隐私说明' : 'privacy notice'}</a>。</span></label>
      <label className="lead-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <div ref={widget} className="lead-verification" />
      <button className="lead-button" type="submit" disabled={!ready || status === 'loading'}>{status === 'loading' ? (zh ? '正在保存…' : 'Saving…') : site === 'ycomer' ? '订阅构建笔记，获取清单 →' : (zh ? '申请 7 天陪伴内测 →' : 'Apply for the guided pilot →')}</button>
      {error && <p className="lead-error" role="alert">{error}</p>}
      <p className="lead-fine">{zh ? '无需付费。申请由 Cloudflare 安全保存。' : 'Free to apply. Your request is stored on Cloudflare.'} <a href="mailto:hello@siliconself.xyz">{zh ? '直接联系' : 'Email Fankus'}</a></p>
    </form>}
  </div>;
}
