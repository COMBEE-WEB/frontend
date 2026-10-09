import Conversation from './Conversation';
export default function ChatLog({ guidedSeed = false, conversationId = null }) { return <Conversation key={conversationId || 'new'} mode="chat" guidedSeed={guidedSeed} conversationId={conversationId}/>; }
