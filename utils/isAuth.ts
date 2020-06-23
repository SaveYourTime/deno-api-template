import { Middleware, Context, Status } from "https://deno.land/x/oak/mod.ts";
import { verify } from "./jwt.ts";
import users from "../data/users.ts";

const { JWT_SECRET_KEY } = Deno.env.toObject();

const isAuth: Middleware = async (ctx: Context, next): Promise<undefined> => {
  const token = ctx.cookies.get("token");
  if (!token) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: "Token not found" };
    return;
  }

  const { payload, isValid } = await verify(token, JWT_SECRET_KEY);

  if (!isValid) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = { message: "Token is invalid" };
    return;
  }

  const { id } = payload.user;
  const user = users.find((user) => user.id === id);
  ctx.state.user = user;
  await next();
};

export default isAuth;
