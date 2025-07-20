import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { TodosService } from './todos.service';
import z from 'zod';
import {
  CreateTodoInput,
  createTodoSchema,
  TodoSchema,
  UpdateTodoInput,
  updateTodoSchema,
} from './todo.schema';

@Router({ alias: 'todos' })
export class TodoRouter {
  constructor(private readonly todosService: TodosService) {}

  @Query({
    input: z.object({ id: z.string() }),
    output: TodoSchema,
  })
  getTodoById(@Input('id') id: string) {
    return this.todosService.getTodoById(id);
  }

  @Query({
    output: z.array(TodoSchema),
  })
  getAllTodos() {
    return this.todosService.getAllTodos();
  }

  @Mutation({
    input: createTodoSchema,
    output: TodoSchema,
  })
  createTodo(@Input() todoData: CreateTodoInput) {
    return this.todosService.createTodo(todoData);
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      data: updateTodoSchema,
    }),
    output: TodoSchema,
  })
  updateTodo(@Input('id') id: string, @Input('data') data: UpdateTodoInput) {
    return this.todosService.updateTodo(id, data);
  }

  @Mutation({
    input: z.object({ id: z.string() }),
    output: z.boolean(),
  })
  deleteTodo(@Input('id') id: string) {
    return this.todosService.deleteTodo(id);
  }
}
