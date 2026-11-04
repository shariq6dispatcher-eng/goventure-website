import { mongo } from "@/lib/mongodb";

type Entry = { exp: number; data?: unknown; pending?: Promise<unknown> };
const store = new Map<string, Entry>();

/**
 * Cached, de-duplicated find() for public pages. Concurrent requests share
 * one database call, results are reused for `ttlMs`, and if the database
 * errors (e.g. 429) we serve the last good data instead of an error page.
 */
export async function cachedFind<T = Record<string, unknown>>(
  collection: string,
  filter: Record<string, unknown> = {},
  sort?: Record<string, unknown>,
  ttlMs = 2 * 60_000
): Promise<T[]> {
  const key = JSON.stringify([collection, filter, sort ?? null]);
  const hit = store.get(key);

  if (hit?.data !== undefined && hit.exp > Date.now()) return hit.data as T[];
  if (hit?.pending) return hit.pending as Promise<T[]>;

  const pending = mongo
    .find<T>(collection, filter, sort)
    .then((data) => {
      store.set(key, { exp: Date.now() + ttlMs, data });
      return data;
    })
    .catch((err) => {
      if (hit?.data !== undefined) {
        store.set(key, { exp: Date.now() + 30_000, data: hit.data });
        return hit.data as T[];
      }
      store.delete(key);
      throw err;
    });

  store.set(key, { ...(hit ?? { exp: 0 }), pending });
  return pending;
}
