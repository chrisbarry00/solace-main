import { asc, desc, ilike, or, sql } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import db from '@/db';
import { advocates } from '@/db/schema';
import { Advocate } from '@/advocate';

const VALID_SORT_KEYS = {
  firstName: advocates.firstName,
  lastName: advocates.lastName,
  city: advocates.city,
  degree: advocates.degree,
  yearsOfExperience: advocates.yearsOfExperience
};

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = (page - 1) * limit;
  const sortKey = searchParams.get('sortKey') || 'lastName';
  const sortDirection = searchParams.get('sortDirection') === 'desc' ? 'desc' : 'asc';
  const searchTerm = searchParams.get('searchTerm')?.toLowerCase() || '';
  const escapedSearch = `%${searchTerm}%`;
  const orderByColumn = VALID_SORT_KEYS[sortKey as keyof typeof VALID_SORT_KEYS] || advocates.lastName;

  try {
    const yearsExpMatch = sql`CAST(
    ${advocates.yearsOfExperience}
    AS
    TEXT
    )
    ILIKE
    ${escapedSearch}`;
    const specialtiesMatch = sql`${advocates.specialties}
    ::TEXT ILIKE
    ${escapedSearch}`;

    const whereClause = searchTerm
      ? or(
        ilike(advocates.firstName, escapedSearch),
        ilike(advocates.lastName, escapedSearch),
        ilike(advocates.city, escapedSearch),
        ilike(advocates.degree, escapedSearch),
        yearsExpMatch,
        specialtiesMatch
      )
      : undefined;

    const data: Advocate[] = await db
      .select()
      .from(advocates)
      .where(whereClause)
      .orderBy(sortDirection === 'asc' ? asc(orderByColumn) : desc(orderByColumn))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .where(whereClause);

    const totalCount = totalResult[0]?.count ?? 0;

    return Response.json({ data, totalCount });
  } catch (err) {
    console.error('Error fetching paginated advocates:', err);
    return new Response('Failed to fetch advocates', { status: 500 });
  }
}
