import { Router, Status, RouterContext } from "https://deno.land/x/oak/mod.ts";
import todos, { Todo } from "../data/todos.ts";

let id: number = 0;

const router = new Router();

router.prefix("/todos");

router.get("/", (ctx: RouterContext) => {
  ctx.response.status = Status.OK;
  ctx.response.body = { todos };
});

router.get("/:id", (ctx: RouterContext): undefined => {
  const { id } = ctx.params;
  const todo = todos.find((todo) => id === todo.id);
  if (!todo) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = { message: `Todo with ID: '${id}' not found` };
    return;
  }
  ctx.response.status = Status.OK;
  ctx.response.body = { todo };
});

router.post(
  "/",
  async (ctx: RouterContext): Promise<undefined> => {
    const data = await ctx.request.body();
    const { text, status } = data.value ?? {};

    if (!text || !status) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: "text or status not found" };
      return;
    }

    const todo: Todo = { id: `${++id}`, text, status };
    todos.push(todo);

    ctx.response.status = Status.OK;
    ctx.response.body = { todo };
  },
);

router.put(
  "/:id",
  async (ctx: RouterContext): Promise<undefined> => {
    const { id } = ctx.params;
    const data = await ctx.request.body();
    const { text, status } = data.value ?? {};

    if (!text || !status) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: "text or status not found" };
      return;
    }

    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: `Todo with ID: '${id}' not found` };
      return;
    }

    todo.text = text;
    todo.status = status;

    ctx.response.status = Status.OK;
    ctx.response.body = { todo };
  },
);

router.delete("/:id", (ctx: RouterContext): void => {
  const { id } = ctx.params;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index >= 0) {
    todos.splice(index, 1);
  }
  ctx.response.status = Status.NoContent;
});

export default router;
