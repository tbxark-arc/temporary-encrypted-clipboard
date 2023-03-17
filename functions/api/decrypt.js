async function handleRequest(request, env) {
  const kv = env.DATABASE;
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }
  const { key, password } = await request.json();
  const storeKey = `${key}:${password || ""}`;
  const content = await kv.get(storeKey);
  if (!content) {
    return new Response(JSON.stringify({ error: "Invalid key or password" }), {
      status: 405,
    });
  }
  await kv.delete(storeKey);
  return new Response(JSON.stringify({ content }), {
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
