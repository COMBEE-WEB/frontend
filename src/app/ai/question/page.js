import Sidebar from "@/components/common/Sidebar";
import AiQuestion from "@/components/ai/AiQuestion";

export default function AiQuestionPage() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f7f7f9",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
        }}
      />

      <AiQuestion />
    </div>
  );
}