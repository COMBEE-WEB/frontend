import PartExplainContents from "@/components/parts/PartExplainContents";

//-------------------
// 선택한 부품의 설명 페이지 표시
//-------------------
export default async function PartExplainDetailPage({ params })
{
    const { partId } = await params;

    return <PartExplainContents partId={partId} />;
}
