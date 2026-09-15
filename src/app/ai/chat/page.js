import Sidebar from "@/components/common/Sidebar";
import ChatLog from "@/components/ai/ChatLog";

export default function AiChatPage() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <ChatLog />
    </div>
  );
}