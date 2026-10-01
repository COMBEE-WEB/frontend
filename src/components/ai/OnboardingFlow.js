'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Boxes, X, ArrowLeft } from 'lucide-react';
import styles from './OnboardingFlow.module.css';

const labels = { beginner: '초급자', intermediate: '중급자', advanced: '고급자' };
const purposes = ['게임', '영상·디자인', '개발', '사무·학습'];
export default function OnboardingFlow({ gate = false, force = false }) {
 const router = useRouter();
 const dialog = useRef(null);
 const busy = useRef(false);
 const [catalog, setCatalog] = useState(null);
 const [stage, setStage] = useState('loading');
 const [level, setLevel] = useState('');
 const [claimed, setClaimed] = useState('');
 const [attempts, setAttempts] = useState({});
 const [quizAnswers, setQuizAnswers] = useState([]);
 const [index, setIndex] = useState(0);
 const [scores, setScores] = useState({});
 const [notice, setNotice] = useState('');
 const [answers, setAnswers] = useState([]);
 const [tags, setTags] = useState([]);
 const [details, setDetails] = useState({ budget_won: '', purpose: '', programs: '', owned: '' });
 const [text, setText] = useState('');
 const [pending, setPending] = useState(false);
 const [error, setError] = useState('');
 const [login, setLogin] = useState(false);
 async function request(path = '', body) {
  const response = await fetch('/api/estimates/onboarding' + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { cache: 'no-store' });
  const data = await response.json();
  if (!response.ok) { setLogin(response.status === 401); throw new Error(typeof data.detail === 'string' ? data.detail : '답변을 확인해주세요.'); }
  return data;
 }
 useEffect(() => {
  let active = true;
  fetch('/api/estimates/onboarding', { cache: 'no-store' }).then(async response => {
   const data = await response.json();
   if (!response.ok) throw Object.assign(new Error(typeof data.detail === 'string' ? data.detail : '진단 정보를 불러오지 못했습니다.'), { status: response.status });
   if (!active) return;
   setCatalog(data);
   if (gate && data.profile) { setStage('hidden'); return; }
   if (data.profile && !force) { setLevel(data.profile.level); setScores(data.profile.scores || {}); setStage('returning'); }
   else setStage('choose');
  }).catch(err => {
   if (!active) return;
   if (gate && err.status === 401) { setStage('hidden'); return; }
   setLogin(err.status === 401); setError(err.message); setStage('error');
  });
  return () => { active = false; };
 }, [gate, force]);
 useEffect(() => {
  if (stage !== 'hidden' && (!gate || stage !== 'loading') && dialog.current && !dialog.current.open) dialog.current.showModal();
 }, [stage, gate]);
 function close() { if (pending) return; dialog.current?.close(); if (gate) setStage('hidden'); else router.push('/ai/chat'); }
 async function grade(selection, allAttempts) {
  if (busy.current) return;
  busy.current = true; setPending(true); setError('');
  try {
   const result = await request('', { claimed_level: selection, attempts: allAttempts });
   setScores(result.scores);
   if (!result.completed) {
    setNotice(labels[level] + ' 진단에서 6점 미만으로, ' + labels[result.next_level] + ' 문제를 이어서 풀어요.');
    setLevel(result.next_level); setQuizAnswers([]); setIndex(0); setStage('quiz');
   } else {
    setLevel(result.level); setStage('result');
    setNotice(result.level !== selection ? '진단 점수에 맞춰 질문 수준을 조정했어요.' : '');
   }
  } catch (err) { setError(err.message); }
  finally { busy.current = false; setPending(false); }
 }
 function choose(value) {
  setClaimed(value); setLevel(value); setAttempts({}); setQuizAnswers([]); setIndex(0); setNotice(''); setError('');
  if (value === 'beginner') grade(value, {}); else setStage('quiz');
 }
 function quizAnswer(value) {
  if (pending) return;
  const next = [...quizAnswers]; next[index] = value; setQuizAnswers(next);
  if (index < 4) setIndex(index + 1);
  else { const all = { ...attempts, [level]: next }; setAttempts(all); grade(claimed, all); }
 }
 function startSurvey() {
  setIndex(0); setAnswers([]); setTags([]); setText(''); setError('');
  setStage(level === 'advanced' ? 'tags' : 'survey');
 }
 function surveyAnswer(value) {
  const next = [...answers]; next[index] = value; setAnswers(next);
  if (index + 1 < catalog.surveys[level].length) setIndex(index + 1);
  else { setIndex(0); setText(''); setStage('details'); }
 }
 async function savePreferences(next) {
  if (busy.current) return;
  busy.current = true; setPending(true); setError('');
  try {
   await request('/preferences', { ...next, answers, keywords: tags });
   router.push('/ai/chat?guided=1');
  } catch (err) { setError(err.message); }
  finally { busy.current = false; setPending(false); }
 }
 function detailAnswer(value) {
  setError('');
  const next = { ...details };
  if (index === 0) {
   const amount = Number(value);
   if (!Number.isInteger(amount) || amount < 30 || amount > 2000) { setError('30~2,000만원 사이의 숫자를 입력해주세요.'); return; }
   next.budget_won = amount * 10000;
  } else if (index === 1) next.purpose = value;
  else if (index === 2) { if (!value.trim()) return; next.programs = value.trim(); }
  else next.owned = value.trim() === '없음' ? '' : value.trim();
  setDetails(next);
  if (index < 3) { setIndex(index + 1); setText(''); } else savePreferences(next);
 }
 if (stage === 'hidden' || (gate && stage === 'loading')) return null;
 const question = stage === 'quiz' ? catalog?.quizzes[level][index] : stage === 'survey' ? catalog?.surveys[level][index] : null;
 return <dialog ref={dialog} className={styles.dialog} aria-labelledby="onboarding-title" onCancel={e => { e.preventDefault(); close(); }}>
  <button className={styles.close} aria-label="닫고 자유채팅으로 이동" onClick={close} disabled={pending}><X size={18}/></button>
  <div className={styles.body}>
   <span className={styles.badge}>{stage === 'quiz' || stage === 'choose' || stage === 'result' ? '수준 진단' : '견적 질문'}</span>
   {stage === 'loading' && <h2 id="onboarding-title">내 진단 정보를 확인하고 있어요…</h2>}
   {stage === 'error' && <><h2 id="onboarding-title">수준 진단을 시작하려면</h2>{!login && <button className={styles.primary} onClick={() => window.location.reload()}>다시 불러오기</button>}</>}
   {stage === 'choose' && <>
    <h2 id="onboarding-title">당신은 어느 정도의 수준인가요?</h2>
    <p>편하게 골라주세요. 수준에 맞는 질문을 준비할게요.</p>
    <div className={styles.options}>{Object.entries(labels).map(([value, label]) => <button key={value} onClick={() => choose(value)} disabled={pending}>{label}</button>)}</div>
    <small>중급·고급은 5문항으로 확인해요. 6점 이상이면 해당 수준으로 진행해요.</small>
   </>}
   {stage === 'quiz' && question && <>
    <div className={styles.progress}>{labels[level]} 진단 · {index + 1} / 5</div>
    {notice && <p role="status">{notice}</p>}
    <h2 id="onboarding-title">{question.question}</h2>
    <div className={styles.options}>{question.options.map((option, i) => <button key={option} disabled={pending} aria-pressed={quizAnswers[index] === i} onClick={() => quizAnswer(i)}>{option}</button>)}</div>
    {index > 0 && <button className={styles.back} disabled={pending} onClick={() => setIndex(index - 1)}><ArrowLeft size={14}/> 이전 질문</button>}
   </>}
   {(stage === 'result' || stage === 'returning') && <>
    <Boxes className={styles.icon} size={36}/>
    <h2 id="onboarding-title">{stage === 'returning' ? '저장된 진단 결과는 ' : '당신은 '}<em>{labels[level]}</em>입니다.</h2>
    <p>사용자 수준에 맞춰 견적에 대한 질문을 드릴게요!</p>
    {Object.entries(scores).map(([key, score]) => <small key={key}>{labels[key]} 진단 {score} / 10점 </small>)}
    {notice && <p>{notice}</p>}
    <button className={styles.primary} onClick={() => gate ? router.push('/ai/question') : startSurvey()}>맞춤 견적 질문 시작하기</button>
    <button className={styles.back} onClick={() => { setStage('choose'); setError(''); }}>수준 다시 진단하기</button>
   </>}
   {stage === 'survey' && question && <>
    <div className={styles.progress}>{labels[level]} 맞춤 질문 · {index + 1} / {catalog.surveys[level].length}</div>
    <h2 id="onboarding-title">{question.question}</h2>
    <div className={styles.options}>{question.options.map((option, i) => <button key={option} aria-pressed={answers[index] === i} onClick={() => surveyAnswer(i)}>{option}</button>)}</div>
    {index > 0 && <button className={styles.back} onClick={() => setIndex(index - 1)}><ArrowLeft size={14}/> 이전 질문</button>}
   </>}
   {stage === 'tags' && <>
    <h2 id="onboarding-title">원하는 구성의 키워드를 골라주세요</h2><p>여러 개 선택할 수 있어요. 자세한 조건은 자유채팅에서 맞춰요.</p>
    <div className={styles.groups}>{Object.entries(catalog.keywords).map(([group, values]) => <section key={group}><h3>{group}</h3><div className={styles.tags}>{values.map(tag => <button key={tag} aria-pressed={tags.includes(tag)} onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}>#{tag}</button>)}</div></section>)}</div>
    <button className={styles.primary} disabled={!tags.length} onClick={() => { setStage('details'); setIndex(0); setText(''); }}>선택 완료 · {tags.length}개</button>
   </>}
   {stage === 'details' && <>
    <div className={styles.progress}>마지막 조건 확인 · {index + 1} / 4</div>
    <h2 id="onboarding-title">{['실제 추천에 사용할 본체 예산을 알려주세요','주 용도를 하나 골라주세요','어떤 게임이나 프로그램을 사용하시나요?','계속 사용할 보유 부품이 있나요?'][index]}</h2>
    <p>{['가격대 대신 정확한 목표 금액을 입력해주세요. (만원)','앞서 답한 취향과 함께 반영할게요.','해상도나 작업 수준도 함께 적어주면 좋아요.','모델명을 적어주세요. 없으면 “없음”을 눌러주세요.'][index]}</p>
    {index === 1 ? <div className={styles.options}>{purposes.map(p => <button key={p} onClick={() => detailAnswer(p)}>{p}</button>)}</div> : <form onSubmit={e => { e.preventDefault(); detailAnswer(text); }}>
     {index === 0 ? <label className={styles.amount}><input autoFocus aria-label="목표 예산 만원" type="number" min="30" max="2000" required value={text} onChange={e => setText(e.target.value)}/>만원</label> : <textarea aria-label={index === 2 ? '사용할 게임 프로그램' : '보유 부품'} required={index === 2} maxLength={index === 2 ? 500 : 300} value={text} onChange={e => setText(e.target.value)} disabled={pending}/>}
     {index === 3 && <button type="button" className={styles.none} disabled={pending} onClick={() => detailAnswer('없음')}>보유 부품 없음</button>}
     <button className={styles.primary} disabled={pending}>{index === 3 ? '저장하고 자유채팅으로 이어가기' : '다음'}</button>
    </form>}
    {index > 0 && <button className={styles.back} disabled={pending} onClick={() => { setIndex(index - 1); setText(index === 1 ? String(details.budget_won / 10000) : index === 3 ? details.programs : ''); }}>이전 질문</button>}
   </>}
   {pending && <p role="status">계정에 저장하고 있어요…</p>}
   {error && <p role="alert" className={styles.error}>{error}{login && <Link href="/auth"> 로그인하기</Link>}</p>}
  </div>
 </dialog>;
}
