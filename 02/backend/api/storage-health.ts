export async function GET(): Promise<Response> {
  const env = process.env;
  return Response.json({
    kv: Boolean(env.KV_REST_API_URL && env.KV_REST_API_TOKEN),
    upstash: Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
    redis: Boolean(env.REDIS_URL),
    postgres: Boolean(env.POSTGRES_URL || env.POSTGRES_PRISMA_URL),
    blob: Boolean(env.BLOB_READ_WRITE_TOKEN),
    adminSecret: Boolean(env.WDFOX_ADMIN_SECRET)
  }, {headers:{'Cache-Control':'no-store'}});
}
