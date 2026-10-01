import { redirect } from 'next/navigation';
export default function FreeCommunityPage() {
  redirect('/community?board=free');
}
