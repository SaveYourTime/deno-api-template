import {
  Application,
  Status,
  Context,
  send,
} from "https://deno.land/x/oak/mod.ts";
import authRoutes from "./routes/auth.ts";
import todoRoutes from "./routes/todo.ts";
import isAuth from "./utils/isAuth.ts";

const { HOST, PORT, ORIGIN } = Deno.env.toObject();

const app = new Application();

// Error handling
app.use(async (ctx: Context, next) => {
  try {
    await next();
    if (ctx.response.status === 404 && !ctx.response.body) {
      ctx.throw(Status.NotFound, "Page Not Found");
    }
  } catch (err) {
    const {
      status = Status.InternalServerError,
      message = "Internal server error",
    } = err;
    ctx.response.status = status;
    ctx.response.body = { statusCode: status, message };
  }
});

// Logger
app.use(async (ctx: Context, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx: Context, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Static content
app.use(async (ctx: Context, next) => {
  try {
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  } catch (err) {
    await next();
  }
});

app.use(authRoutes.routes(), authRoutes.allowedMethods());
app.use(isAuth, todoRoutes.routes(), todoRoutes.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const URL = `${secure ? "https" : "http"}://${hostname}:${port}`;
  console.log(`Application is running on: ${URL}`);
  console.log(`Accepting requests from origin: "${ORIGIN}"`);
});

await app.listen({ hostname: HOST, port: +PORT });
