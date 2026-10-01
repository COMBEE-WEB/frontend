import ChatLog from '@/components/ai/ChatLog';
export default async function AiChatPage({ searchParams }) {
 const params = await searchParams;
 return <ChatLog guidedSeed={params.guided === '1'}/>;
}
