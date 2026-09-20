export async function GET(): Promise<Response> {
  return Response.json({
    kv: Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
    upstash: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
    postgres: Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL),
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    ownerSecret: Boolean(process.env.FOX_OWNER_SECRET || process.env.ADMIN_TOKEN || process.env.OWNER_TOKEN)
  }, {headers:{'Cache-Control':'no-store'}});
}
