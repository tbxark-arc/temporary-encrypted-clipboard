function randomString(length) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function handleRequest(request, env) {
  const kv = env.DATABASE;
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }
  const { content, password } = await request.json();
  const key = randomString(6);
  const storeKey = `${key}:${password || ""}`;
  const domain = new URL(request.url).host;
  const url = `https://${domain}/d/${key}?pwd=${password}`;
  await kv.put(storeKey, content, { expirationTtl: 86400 });
  return new Response(JSON.stringify({ url }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function onRequest(context) {
  try {
    const { request, env } = context;
    return handleRequest(request, env);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
