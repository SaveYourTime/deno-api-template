import { Application } from "https://deno.land/x/oak/mod.ts";

const { HOST, PORT, ORIGIN } = Deno.env.toObject();

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Hello World!
app.use((ctx) => {
  ctx.response.body = "Hello World!";
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const URL = `${secure ? "https" : "http"}://${hostname}:${port}`;
  console.log(`Application is running on: ${URL}`);
  console.log(`Accepting requests from origin: "${ORIGIN}"`);
});

await app.listen({ hostname: HOST, port: +PORT });
