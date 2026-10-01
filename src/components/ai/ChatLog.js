import Conversation from './Conversation';
export default function ChatLog({ guidedSeed = false }) { return <Conversation mode="chat" guidedSeed={guidedSeed}/>; }
