import db from '../../../db';
import { advocates } from '@/db/schema';
import { Advocate } from '@/advocate';

export async function GET(): Promise<Response> {
  try {
    const data: Advocate[] = await db.select().from(advocates);
    return Response.json({ data });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return new Response('Failed to fetch advocates', { status: 500 });
  }
}

