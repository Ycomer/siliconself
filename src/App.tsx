import SEOHead from './components/SEOHead';
import LangSwitch from './components/LangSwitch';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import Why from './sections/Why';
import Who from './sections/Who';
import Zen from './sections/Zen';
import How from './sections/How';
import Vision from './sections/Vision';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import Experiment from './sections/Experiment';
import {useTranslation} from 'react-i18next';

export default function App() {
  const {i18n} = useTranslation();
  const zh = i18n.language.startsWith('zh');
  return (
    <>
      <SEOHead />
      <LangSwitch />
      <Hero />
      <section className="mirror-example-section"><p className="section-label">A SMALL EXAMPLE</p><h2>{zh ? '镜子里，会出现什么？' : 'What could a reflection look like?'}</h2><div className="mirror-example"><small>{zh ? '虚构示例 · 展示复盘方式，并非用户数据或真实 AI 输出' : 'Illustrative example · Not real user data or AI output'}</small><p>{zh ? '意图：这周开始验证产品需求。' : 'Intention: Start validating product demand this week.'}</p><p>{zh ? '行动：调整了三次页面，尚未开始用户访谈。' : 'Action: Revised the page three times; no user interviews yet.'}</p><p>{zh ? '值得追问：今天能否用一次真实对话，代替一次页面调整？' : 'A question to explore: Could one real conversation replace another page revision today?'}</p></div><a className="cta-btn" href="#experiment">{zh ? '开始我的第一条记录 →' : 'Write my first entry →'}</a></section>
      <Experiment />
      <Manifesto />
      <Why />
      <Who />
      <Zen />
      <How />
      <Vision />
      <CTA />
      <section id="privacy" className="privacy-copy"><h2>{zh ? '你的记录，由你掌握。' : 'Your journal stays with you.'}</h2><p>{zh ? '自助实验的日记只存储于当前浏览器，不上传、不用于训练，也不会通过邮件发送。共享设备上的其他使用者可能看到本地记录。你可以随时导出或清除。' : 'Self-guided journal entries stay in this browser. They are not uploaded, used for training or emailed. Other people using the same browser may access local entries. You can export or clear them at any time.'}</p><p>{zh ? '内测表单只收集邮箱、兴趣、可选目标、联系许可与来源渠道，保存于 Cloudflare D1，并通过 Cloudflare 邮件服务通知 Fankus 的已验证收件邮箱。只按你选择的兴趣跟进，不出售资料。日记内容和邮箱不会发送到访问统计。' : 'The pilot form collects your email, focus, optional goal, consent and referral source. Requests are stored in Cloudflare D1 and sent through Cloudflare Email to Fankus’s verified inbox. Follow-up is limited to your selected interest; data is not sold. Journal text and email addresses are not sent to analytics.'}</p><p>{zh ? '如需退订、导出或删除申请，请写信至' : 'For unsubscribe, export or deletion requests, contact'} <a href="mailto:hello@fankus.me">hello@fankus.me</a>。{zh ? '陪伴内测仍在招募；AI 分析与付费方案尚未开放。' : 'The guided pilot is recruiting. AI analysis and paid plans are not yet available.'}</p></section>
      <Footer />
    </>
  );
}
