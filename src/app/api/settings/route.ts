import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { getSetting } from '@/utils/server/api/settings';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return new Response(
      JSON.stringify({ error: 'key parameter is required' }),
      { status: 400 }
    );
  }

  return handleApiRequest(async () => {
    return await getSetting(key);
  });
} 