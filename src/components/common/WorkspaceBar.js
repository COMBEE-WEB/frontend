import Link from 'next/link';
import { ChevronRight, PanelsTopLeft, UserRound } from 'lucide-react';
import styles from './WorkspaceBar.module.css';
export default function WorkspaceBar({ section, title }) {
 return <div className={styles.bar}>
  <div className={styles.path}><PanelsTopLeft size={15}/><span>{section}</span><ChevronRight size={12}/><strong>{title}</strong></div>
  <Link href="/account" aria-label="내 계정"><UserRound size={15}/><span>내 계정</span></Link>
 </div>;
}
