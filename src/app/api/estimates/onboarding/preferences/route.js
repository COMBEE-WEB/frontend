import { estimatesProxy } from '@/lib/estimates-proxy';
export async function POST(request) { return estimatesProxy(request, 'onboarding/preferences'); }
