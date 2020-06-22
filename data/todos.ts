export enum TodoStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Todo {
  id: string;
  text: string;
  status: TodoStatus;
}

const todos: Todo[] = [];

export default todos;
