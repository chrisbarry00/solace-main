import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const setup = (): PostgresJsDatabase<typeof schema> => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set.');
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL);
  return drizzle(queryClient, { schema });
};

export default setup();
