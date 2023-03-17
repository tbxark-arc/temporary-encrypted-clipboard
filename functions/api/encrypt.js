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
    return new Response({ error: "Method not allowed" }, { status: 405 });
  }
  const { content, password } = await request.json();
  const key = randomString(10);
  const storeKey = `${key}:${password || ""}`;
  const url = `${url.origin}/d/${key}?password=${password}`;
  await kv.put(storeKey, content);
  return new Response(JSON.stringify({ key: data.key }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default {
  async fetch(request, env) {
    try {
      return handleRequest(request, env);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 405,
      });
    }
  },
};
