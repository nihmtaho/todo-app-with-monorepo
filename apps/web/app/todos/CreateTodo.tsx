"use client";

import { useState } from "react";
import { trpc } from "../../trpc/client";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("");
  const utils = trpc.useUtils();

  const mutation = trpc.todos.createTodo.useMutation({
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("");
      utils.todos.getAllTodos.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return;
    }

    mutation.mutate({
      title,
      description,
      completed: false,
      ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
      priority: priority || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Todo</h2>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo title"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2 outline-none"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Todo description"
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2 mt-2 outline-none"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2 mt-2 outline-none"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high" | "")}
          className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2 mt-2 outline-none"
        >
          <option value="" disabled>Select Priority (optional)</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Todo"}
      </button>
    </form>
  );
}
