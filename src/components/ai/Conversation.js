'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, RotateCcw, Sparkles } from 'lucide-react';
import Sidebar from '@/components/common/Sidebar';
import WorkspaceBar from '@/components/common/WorkspaceBar';
import BrandMark from '@/components/common/BrandMark';
import EstimateResult from './EstimateResult';
import styles from './Conversation.module.css';

const questions = [
 '안녕하세요, BEEBEE예요. 본체 예산은 얼마로 생각하고 계세요?',
 'PC를 주로 어떤 용도로 사용하실 건가요?',
 '주로 사용할 게임이나 프로그램을 알려주세요. 원하는 해상도나 작업 수준도 함께 적어주면 좋아요.',
 '계속 사용할 부품이 있나요? 없으면 “없음”이라고 답해주세요.',
];
const purposes = ['게임', '영상·디자인', '개발', '사무·학습'];
function budgetValue(text) {
 const value = text.replaceAll(',', '').replace(/\s/g, '');
 if (!/^\d+(\.\d+)?(만원|만|원)?$/.test(value)) return null;
 const n = parseFloat(value);
 const won = value.includes('만') || (!value.endsWith('원') && n <= 2000) ? n * 10000 : n;
 return Number.isInteger(won) && won >= 300000 && won <= 20000000 ? won : null;
}
export default function Conversation({ mode = 'chat', guidedSeed = false }) {
 const guided = mode === 'question';
 const [messages, setMessages] = useState(guided ? [{ role: 'assistant', content: questions[0] }] : []);
 const [input, setInput] = useState('');
 const [step, setStep] = useState(0);
 const [conditions, setConditions] = useState({});
 const [ready, setReady] = useState(false);
 const [pending, setPending] = useState(guidedSeed ? 'context' : '');
 const [error, setError] = useState('');
 const [login, setLogin] = useState(false);
 const lock = useRef(false);
 const bottom = useRef(null);
 const inputRef = useRef(null);
 useEffect(() => {
  if (!guidedSeed) return;
  let active = true;
  fetch('/api/estimates/onboarding', { cache: 'no-store' }).then(async response => {
   const data = await response.json();
   if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : '저장한 조건을 불러오지 못했습니다.');
   const saved = data.profile?.preferences?.conditions;
   if (!saved) throw new Error('먼저 견적 질문을 완료해주세요.');
   if (!active) return;
   setConditions(saved); setReady(true);
   setMessages([{ role: 'user', content: '수준별 질문을 완료했어요. 본체 예산 ' + (saved.budget_won / 10000) + '만원, 용도는 ' + saved.purpose + ', 사용할 프로그램은 ' + saved.programs + '입니다.' },
    { role: 'assistant', content: (data.levels[data.profile.level] || '') + ' 맞춤 답변을 가져왔어요. 선택한 취향을 반영해 견적을 만들거나, 여기서 조건을 더 이야기해주세요.' }]);
  }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setPending(''); });
  return () => { active = false; };
 }, [guidedSeed]);
 useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, pending]);
 function reset() {
  if (lock.current) return;
  setMessages(guided ? [{ role: 'assistant', content: questions[0] }] : []);
  setConditions({}); setReady(false); setStep(0); setInput(''); setError(''); setLogin(false);
 }
 async function api(path, body) {
  const response = await fetch('/api/estimates' + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) {
   setLogin(response.status === 401);
   throw new Error(typeof data.detail === 'string' ? data.detail : '입력 내용을 확인해주세요.');
  }
  return data;
 }
 async function send(value = input) {
  const text = value.trim();
  if (!text || lock.current || pending) return;
  setError(''); setLogin(false);
  if (guided) {
   const next = { ...conditions };
   if (step === 0) {
    const budget = budgetValue(text);
    if (!budget) { setError('예산을 30~2,000만원 사이로 입력해주세요. 예: 150만원'); return; }
    next.budget_won = budget;
   } else if (step === 1) {
    if (!purposes.includes(text)) { setError('아래 용도 중 하나를 선택해주세요.'); return; }
    next.purpose = text;
   } else if (step === 2) next.programs = text;
   else next.owned = text === '없음' ? '' : text;
   setConditions(next); setInput('');
   setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: step < 3 ? questions[step + 1] : '조건을 모두 확인했어요. 아래 버튼을 누르면 등록된 부품에서 견적을 추천해드릴게요.' }]);
   setStep(step + 1); setReady(step === 3);
   return;
  }
  const history = [...messages.filter(m => !m.result).map(({ role, content }) => ({ role, content })), { role: 'user', content: text }];
  if (history.length > 20 || history.reduce((sum, m) => sum + m.content.length, 0) > 8000) {
   setError('대화가 길어졌어요. 새 대화를 시작해주세요. 저장된 견적은 홈에서 다시 볼 수 있어요.'); return;
  }
  lock.current = true; setPending('reply');
  try {
   const data = await api('/chat', { messages: history });
   setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.reply }]);
   setInput(''); setConditions(data.conditions); setReady(data.ready);
  } catch (err) { setError(err.message || '답변을 받지 못했습니다.'); }
  finally { lock.current = false; setPending(''); inputRef.current?.focus(); }
 }
 async function generate() {
  if (!ready || lock.current) return;
  lock.current = true; setPending('estimate'); setError(''); setLogin(false);
  try {
   const result = await api('', conditions);
   setMessages(prev => [...prev, { role: 'assistant', content: '등록 부품으로 구성한 견적이에요.', result }]);
   setReady(false);
  } catch (err) { setError(err.message || '견적을 생성하지 못했습니다.'); }
  finally { lock.current = false; setPending(''); }
 }
 const empty = messages.length === 0;
 const chips = guided && step < 4 ? step === 0 ? ['100만원', '150만원', '200만원'] : step === 1 ? purposes : step === 3 ? ['없음'] : [] : [];
 const composer = <form className={styles.composer} onSubmit={e => { e.preventDefault(); send(); }}>
  <Sparkles size={19} aria-hidden="true"/>
  <textarea ref={inputRef} aria-label={guided ? '질문에 답하기' : 'BEEBEE에게 메시지 보내기'} placeholder={guided ? step === 0 ? '예: 150만원' : '답변을 입력해주세요' : 'BEEBEE에게 견적 물어보기'}
   rows={1} maxLength={1000} value={input} disabled={Boolean(pending)}
   onChange={e => setInput(e.target.value)}
   onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }}/>
  <button type="submit" aria-label="메시지 보내기" disabled={!input.trim() || Boolean(pending)}><ArrowUp size={18}/></button>
 </form>;
 return <div className={styles.shell}>
  <Sidebar/>
  <main className={styles.main}>
   <WorkspaceBar section="AI 견적" title="견적 워크스페이스"/>
   {!empty && <div className={styles.header}>
    <button onClick={reset} disabled={Boolean(pending)}><RotateCcw size={14}/>새 대화</button>
   </div>}
   {empty ? <section className={styles.start}>
    <BrandMark size={58}/><p className={styles.eyebrow}>YOUR PC, YOUR WAY</p><h1>오늘은 어떤 견적을 맞춰볼까요?</h1><p className={styles.intro}>예산부터 궁금한 부품까지, BEEBEE에게 편하게 물어보세요.</p>
    <div className={styles.startComposer}>{composer}</div>
    {pending && <p role="status">BEEBEE가 답변을 생각하고 있어요…</p>}
    {error && <p role="alert" className={styles.error}>{error}{login && <Link href="/auth"> 로그인하기</Link>}</p>}
   </section> : <>
    <section className={styles.scroll} aria-label="견적 대화">
     <div className={styles.messages}>
      {messages.map((m, i) => <article key={i} className={m.role === 'user' ? styles.user : styles.assistant}>
       {m.role === 'assistant' && <span className={styles.name}>BEEBEE</span>}
       {m.result ? <><EstimateResult result={m.result}/>{m.result.id && <Link className={styles.saved} href={'/ai/estimates/' + m.result.id}>저장된 견적 열기 →</Link>}</> : <p>{m.content}</p>}
      </article>)}
      {pending && <p className={styles.status} role="status">{pending === 'estimate' ? '등록 부품을 비교해 견적을 만들고 있어요. 잠시만 기다려주세요…' : 'BEEBEE가 답변을 생각하고 있어요…'}</p>}
      <div ref={bottom}/>
     </div>
    </section>
    <footer className={styles.footer}>
     {chips.length > 0 && <div className={styles.chips}>{chips.map(text => <button key={text} disabled={Boolean(pending)} onClick={() => send(text)}>{text}</button>)}</div>}
     {ready && <div className={styles.confirm}><span>본체 {(conditions.budget_won / 10000).toLocaleString('ko-KR')}만원 · {conditions.purpose}</span><button disabled={Boolean(pending)} onClick={generate}>이 조건으로 견적 만들기 <ArrowUp size={15}/></button></div>}
     {error && <p role="alert" className={styles.error}>{error}{login && <Link href="/auth"> 로그인하기</Link>}</p>}
     {(!guided || step < 4) && composer}
     {guided && step >= 4 && !ready && !pending && <button className={styles.restart} onClick={reset}>다른 조건으로 다시 질문하기</button>}
     <p className={styles.note}>가격·호환성은 추가 확인이 필요해요. 생성한 견적은 내 계정에 비공개로 저장돼요.</p>
    </footer>
   </>}
  </main>
 </div>;
}
