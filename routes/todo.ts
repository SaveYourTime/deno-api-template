import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

router.prefix("/todo");

router.get("/", (ctx, next) => {
  console.log(ctx.request);
  ctx.response.status = 200;
  ctx.response.body = { message: "message from /todo/" };
});

export default router;
