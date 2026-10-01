import CommunityBoard from '@/components/community/CommunityBoard';
export default async function CommunityPage({ searchParams }) {
 const params = await searchParams;
 const board = params.board === 'build_share' ? 'build_share' : 'free';
 const post = /^[1-9]\d*$/.test(params.post || '') ? Number(params.post) : null;
 return <CommunityBoard key={board} board={board} initialPost={post}/>;
}
