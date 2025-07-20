import { Injectable } from '@nestjs/common';
import { CreateTodoInput, Todo, UpdateTodoInput } from './todo.schema';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  getTodoById(id: string): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    return todo;
  }

  getAllTodos(): Todo[] {
    return this.todos;
  }

  createTodo(todoData: CreateTodoInput) {
    const newTodo: Todo = {
      ...todoData,
      id: Math.random().toString(36).substring(2, 15), // Simple ID generation
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  updateTodo(id: string, data: UpdateTodoInput): Todo {
    const todoIndex = this.todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    const updatedTodo = { ...this.todos[todoIndex], ...data };
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  deleteTodo(id: string): boolean {
    const todoIndex = this.todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    this.todos.splice(todoIndex, 1);
    return true;
  }
}
