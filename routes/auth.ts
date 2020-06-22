import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.prefix("/auth");

router.post("/signup", (ctx, next) => {
  console.log(ctx.request);
  ctx.response.status = 200;
  ctx.response.body = { message: "message from /auth/signup" };
});

router.post("/signin", (ctx, next) => {
  console.log(ctx.request);
  ctx.response.status = 200;
  ctx.response.body = { message: "message from /auth/signin" };
});

export default router;
