"use client";

import dayjs from "dayjs";
import { trpc } from "../../trpc/client";
import CreateTodo from "./CreateTodo";

export default function TodosPage() {
  const {data: todos} = trpc.todos.getAllTodos.useQuery();
  const utils = trpc.useUtils();

  const updateMutation = trpc.todos.updateTodo.useMutation({
    onSuccess: () => {
      utils.todos.getAllTodos.invalidate();
    },
  });

  const deleteMutation = trpc.todos.deleteTodo.useMutation({
    onSuccess: () => {
      utils.todos.getAllTodos.invalidate();
    },
  });

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateMutation.mutate({
      id,
      data: {
        completed: !completed,
      }
    });
  };

  const handleDeleteTodo = (id: string) => {
    deleteMutation.mutate({ id });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <CreateTodo />
      <div className="mt-6"></div>
      {
        todos?.map(todo => (
          <div key={todo.id} className="p-4 mb-4 bg-white rounded shadow">
            <h3 className={todo.completed ? "line-through text-gray-500" : "font-semibold"}>{todo.title}</h3>
            <p className="text-gray-500">{todo.description}</p>
            <div className="text-sm text-gray-400">
              <span>Due at: {dayjs(todo.dueDate).format("MMM D, YYYY") || "No due date"}</span>
              <span> | Priority: {todo.priority || "None"}</span>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={() => handleToggleComplete(todo.id, todo.completed)} className="text-blue-500 hover:underline">
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}