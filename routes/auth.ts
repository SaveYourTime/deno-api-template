import { Router, Status, RouterContext } from "https://deno.land/x/oak/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { sign } from "../utils/jwt.ts";
import users, { User } from "../data/users.ts";

let id: number = 0;

const { JWT_EXPIRES_IN } = Deno.env.toObject();

const router = new Router();

router.prefix("/auth");

router.post(
  "/signup",
  async (ctx: RouterContext): Promise<undefined> => {
    const data = await ctx.request.body();
    const { username, password } = data.value ?? {};

    if (!username || password) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: "username or password not found" };
      return;
    }

    const hasUser = users.find((user) => user.username === username);
    if (hasUser) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: "Username already exists" };
      return;
    }

    const hashedPassword = await bcrypt.hash(password);
    const user: User = { id: `${++id}`, username, password: hashedPassword };
    users.push(user);

    ctx.response.status = Status.OK;
    ctx.response.body = { user: { ...user, password: undefined } };
  },
);

router.post(
  "/signin",
  async (ctx: RouterContext): Promise<undefined> => {
    const data = await ctx.request.body();
    const { username, password } = data.value ?? {};

    if (!username || !password) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: "username or password not found" };
      return;
    }

    const user = users.find((user) => user.username === username);
    if (!user) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { message: "User not found" };
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = { message: "username or password are invalid" };
      return;
    }

    const token = sign({ user: { ...user, password: undefined } });
    ctx.cookies.set("token", token, {
      maxAge: +JWT_EXPIRES_IN,
      httpOnly: true,
    });
    ctx.response.status = Status.OK;
    ctx.response.body = { token };
  },
);

export default router;
