import {useState} from 'react';
import type {FormEvent} from 'react';
import {useTranslation} from 'react-i18next';
import {trackEvent} from '../utils/analytics';
import './Experiment.css';

type Entry = {date: string; intention: string; action: string; observation: string};
const KEY = 'silicon-self-seven-days-v1';
const today = () => {const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
function readEntries(): Entry[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(value) ? value.filter((e): e is Entry => e && ['date','intention','action','observation'].every(k => typeof e[k] === 'string')).slice(0,7) : [];
  } catch {return [];}
}
export default function Experiment() {
  const {i18n} = useTranslation();
  const zh = i18n.language.startsWith('zh');
  const [entries,setEntries] = useState<Entry[]>(readEntries);
  const [message,setMessage] = useState('');
  const [confirmClear,setConfirmClear] = useState(false);
  const current = entries.find(e => e.date === today());
  const complete = entries.length === 7;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const entry = {date: today(), intention: String(form.get('intention')).trim(), action: String(form.get('action')).trim(), observation: String(form.get('observation')).trim()};
    if (!entry.intention || !entry.action) return;
    const next = [...entries.filter(e => e.date !== entry.date),entry].slice(0,7);
    try {localStorage.setItem(KEY,JSON.stringify(next)); setEntries(next); setMessage(zh ? '今天的记录已保存在这台设备。' : 'Today’s entry is saved on this device.'); trackEvent('experiment_entry_saved','conversion',String(next.length));}
    catch {setMessage(zh ? '浏览器未允许本地保存，请先导出备份。' : 'Local storage is unavailable. Export a backup.');}
  }
  function download() {
    const text = ['SILICON SELF / 7 DAY REFLECTION', ...entries.map(e => `${e.date}\nIntention: ${e.intention}\nAction: ${e.action}\nObservation: ${e.observation}`), zh ? '复盘提示：哪些目标反复出现？什么行动帮助了你？下一周只改变哪一件事？\n这是一份自助复盘，不是 AI 分析或诊断。' : 'Reflect: Which intentions recur? Which actions helped? What one thing will you change next week?\nThis is a self-guided reflection, not AI analysis or diagnosis.'].join('\n\n');
    const url = URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'silicon-self-reflection.txt'; a.click(); URL.revokeObjectURL(url);
    trackEvent('experiment_export','conversion');
  }
  return <section id="experiment" className="experiment">
    <p className="section-label">01 / YOUR FIRST SEVEN DAYS</p>
    <h2>{zh ? '每天三句话。七天后，再看一次。' : 'Three lines a day. A different view in seven days.'}</h2>
    <p>{zh ? '现在就能开始的自助实验：写下意图、行动与观察。内容只保存在当前浏览器，不发送到服务器或 AI。' : 'A self-guided experiment you can start now. Record an intention, an action and an observation. Entries stay in this browser; they are not sent to a server or AI.'}</p>
    <div className="experiment-days" aria-label={zh ? '记录进度' : 'Journal progress'}>{Array.from({length:7},(_,i)=><span className={i < entries.length ? 'done' : ''} key={i}>{String(i+1).padStart(2,'0')}</span>)}</div>
    <p className="experiment-caption">{entries.length}/7 {zh ? '个记录日 · 每个自然日一条，可以修改当天内容。清除浏览器数据会丢失记录，请定期导出。' : 'days recorded · One entry per calendar day. You can edit today’s entry. Export regularly; clearing browser data removes entries.'}</p>
    {(!complete || current) && <form key={today()} onSubmit={save} className="experiment-form">
      <label>{zh ? '今天，我想推进什么？' : 'What do I intend to move forward today?'}<textarea name="intention" defaultValue={current?.intention} required maxLength={1000} rows={2}/></label>
      <label>{zh ? '实际上，我做了什么？' : 'What did I actually do?'}<textarea name="action" defaultValue={current?.action} required maxLength={1000} rows={2}/></label>
      <label>{zh ? '我注意到了什么？（选填）' : 'What did I notice? (optional)'}<textarea name="observation" defaultValue={current?.observation} maxLength={1000} rows={2}/></label>
      <button className="cta-btn cta-btn-primary" type="submit">{zh ? (current ? '更新今天的记录' : '保存今天的记录') : (current ? 'Update today’s entry' : 'Save today’s entry')}</button>
    </form>}
    {message && <p role="status">{message}</p>}
    {entries.length > 0 && <div className="experiment-review">
      <h3>{zh ? (complete ? '你的七天镜像' : '回看已经发生的事') : (complete ? 'Your seven-day reflection' : 'Look back at what happened')}</h3>
      {entries.map(e=><article key={e.date}><time>{e.date}</time><p><strong>{zh ? '意图：' : 'Intention: '}</strong>{e.intention}</p><p><strong>{zh ? '行动：' : 'Action: '}</strong>{e.action}</p>{e.observation && <p>{e.observation}</p>}</article>)}
      {complete && <p>{zh ? '哪些目标反复出现？什么行动真正帮助了你？下一周，你只想改变哪一件事？' : 'Which intentions recur? Which actions helped? What one thing will you change next week?'}</p>}
      <div className="experiment-actions"><button className="cta-btn" onClick={download}>{zh ? '导出我的复盘' : 'Export my reflection'}</button><button className="cta-btn" onClick={()=>setConfirmClear(true)}>{zh ? '清除本地记录' : 'Clear local entries'}</button></div>
      {confirmClear && <div role="alert"><p>{zh ? '这会删除本浏览器中的 7 天记录。建议先导出备份。' : 'This removes the journal from this browser. Export a backup first.'}</p><button className="cta-btn" onClick={()=>{try {localStorage.removeItem(KEY);setEntries([]);setConfirmClear(false);setMessage('');}catch {setMessage(zh ? '删除失败，请在浏览器设置中清理本站数据。' : 'Unable to clear. Use your browser’s site-data settings.');}}}>{zh ? '确认删除' : 'Confirm removal'}</button><button className="cta-btn" onClick={()=>setConfirmClear(false)}>{zh ? '取消' : 'Cancel'}</button></div>}
    </div>}
    <a className="experiment-next" href="#join" onClick={()=>trackEvent('cta_click','conversion','guided-pilot')}>{zh ? '希望有人陪你复盘？申请陪伴内测 →' : 'Want a guided reflection? Apply for the pilot →'}</a>
  </section>;
}
