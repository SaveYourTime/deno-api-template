import { Router, Status } from "https://deno.land/x/oak/mod.ts";
import todos, { Todo } from "../data/todos.ts";

let id = 0;

const router = new Router();

router.prefix("/todos");

router.get("/", (ctx) => {
  ctx.response.status = Status.OK;
  ctx.response.body = { todos };
});

router.get("/:id", (ctx) => {
  const { id } = ctx.params;
  const todo = todos.find((todo) => id === todo.id);
  if (todo) {
    ctx.response.status = Status.OK;
    ctx.response.body = { todo };
  } else {
    ctx.response.status = Status.NotFound;
    ctx.response.body = { message: `Todo with ID: '${id}' not found.` };
  }
});

router.post("/", async (ctx) => {
  const data = await ctx.request.body();
  const { text, status } = data.value ?? {};

  if (text && status) {
    const todo: Todo = { id: `${++id}`, text, status };
    todos.push(todo);

    ctx.response.status = Status.OK;
    ctx.response.body = { todo };
  } else {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = { message: `Missing text or status` };
  }
});

router.put("/:id", async (ctx) => {
  const { id } = ctx.params;
  const data = await ctx.request.body();
  const { text, status } = data.value ?? {};

  if (text && status) {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      todo.text = text;
      todo.status = status;
      ctx.response.status = Status.OK;
      ctx.response.body = { todo };
    } else {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = { message: `Todo with ID: '${id}' not found.` };
    }
  } else {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = { message: `Missing text or status` };
  }
});

router.delete("/:id", (ctx) => {
  const { id } = ctx.params;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index >= 0) {
    todos.splice(index, 1);
  }
  ctx.response.status = Status.NoContent;
});
export default router;
