/**
 * Cloudflare Workers-compatible MongoDB client.
 *
 * IMPORTANT: The native `mongodb` npm driver opens raw TCP/TLS sockets
 * (Node's `net`/`tls` modules) and, for `mongodb+srv://` URIs, performs a
 * DNS SRV lookup (Node's `dns` module). Cloudflare Workers (even with the
 * `nodejs_compat` flag) do not support arbitrary outbound TCP sockets or
 * DNS resolution the way the driver expects. Any route that imported the
 * old driver-based client would throw at runtime on Cloudflare, which is
 * the root cause of the Error 1103 responses on every DB-backed page.
 *
 * The fix: talk to MongoDB Atlas over HTTPS using the Atlas Data API,
 * which is just `fetch()` under the hood and works identically in
 * Node.js, Vercel, and Cloudflare Workers.
 *
 * Setup required in MongoDB Atlas:
 *   1. Atlas UI -> Data API -> Enable the Data API for your cluster.
 *   2. Copy the generated "Data API URL Endpoint" (looks like
 *      https://<region>.data.mongodb-api.com/app/<app-id>/endpoint/data/v1)
 *   3. Create a Data API Key (Atlas UI -> Data API -> Create API Key).
 *
 * Required environment variables (set via `wrangler secret put` or the
 * Cloudflare dashboard -> Settings -> Variables):
 *   MONGODB_DATA_API_URL   e.g. https://us-east-1.aws.data.mongodb-api.com/app/data-abcde/endpoint/data/v1
 *   MONGODB_DATA_API_KEY   the Data API key created above
 *   MONGODB_DATA_SOURCE    the name of your Atlas cluster (e.g. "Cluster0")
 *   MONGODB_DATABASE       database name (defaults to "goventure")
 */

<<<<<<< HEAD
type JsonRecord = Record<string, unknown>;

interface DataApiConfig {
  url: string;
  apiKey: string;
  dataSource: string;
  database: string;
}

function getConfig(): DataApiConfig {
  const url = process.env.MONGODB_DATA_API_URL;
  const apiKey = process.env.MONGODB_DATA_API_KEY;
  const dataSource = process.env.MONGODB_DATA_SOURCE;
  const database = process.env.MONGODB_DATABASE || "goventure";

  if (!url || !apiKey || !dataSource) {
    throw new Error(
      "Missing MongoDB Data API configuration. Please set MONGODB_DATA_API_URL, " +
        "MONGODB_DATA_API_KEY and MONGODB_DATA_SOURCE as environment variables/secrets."
    );
  }

  return { url, apiKey, dataSource, database };
}

async function callDataApi<T = unknown>(
  action:
    | "find"
    | "findOne"
    | "insertOne"
    | "updateOne"
    | "deleteOne"
    | "deleteMany",
  collection: string,
  body: JsonRecord
): Promise<T> {
  const config = getConfig();
=======
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const uri: string = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
>>>>>>> c793eac1b7c99797abfcc5d70074259a10c67a2b

  const res = await fetch(`${config.url}/action/${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": config.apiKey,
    },
    body: JSON.stringify({
      dataSource: config.dataSource,
      database: config.database,
      collection,
      ...body,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `MongoDB Data API request failed (${action} on ${collection}): ${res.status} ${text}`
    );
  }

  return (await res.json()) as T;
}

/** Converts a 24-char hex string into the Data API's Extended JSON ObjectId form. */
export function toObjectId(id: string): { $oid: string } {
  return { $oid: id };
}

export const mongo = {
  /** Find many documents, optionally sorted. */
  async find<T = JsonRecord>(
    collection: string,
    filter: JsonRecord = {},
    sort?: JsonRecord
  ): Promise<T[]> {
    const data = await callDataApi<{ documents: T[] }>("find", collection, {
      filter,
      ...(sort ? { sort } : {}),
    });
    return data.documents;
  },

  /** Find a single document. */
  async findOne<T = JsonRecord>(
    collection: string,
    filter: JsonRecord
  ): Promise<T | null> {
    const data = await callDataApi<{ document: T | null }>(
      "findOne",
      collection,
      { filter }
    );
    return data.document;
  },

  /** Insert a single document. */
  async insertOne(
    collection: string,
    document: JsonRecord
  ): Promise<{ insertedId: string }> {
    const data = await callDataApi<{ insertedId: string }>(
      "insertOne",
      collection,
      { document }
    );
    return data;
  },

  /** Delete a single document. */
  async deleteOne(
    collection: string,
    filter: JsonRecord
  ): Promise<{ deletedCount: number }> {
    const data = await callDataApi<{ deletedCount: number }>(
      "deleteOne",
      collection,
      { filter }
    );
    return data;
  },

  /** Update a single document. */
  async updateOne(
    collection: string,
    filter: JsonRecord,
    update: JsonRecord
  ): Promise<{ matchedCount: number; modifiedCount: number }> {
    const data = await callDataApi<{
      matchedCount: number;
      modifiedCount: number;
    }>("updateOne", collection, { filter, update: { $set: update } });
    return data;
  },
};

export default mongo;
