import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { getHolidays } from '@/utils/server/api/holidays';

export async function GET() {
  return handleApiRequest(async () => {
    return await getHolidays();
  });
}
