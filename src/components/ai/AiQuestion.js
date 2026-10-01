import Sidebar from '@/components/common/Sidebar';
import OnboardingFlow from './OnboardingFlow';
import styles from './Conversation.module.css';
export default function AiQuestion({ force = false }) {
 return <div className={styles.shell}><Sidebar/><main className={styles.main}><header className={styles.header}>AI 견적 · 견적 질문</header><OnboardingFlow force={force}/></main></div>;
}
