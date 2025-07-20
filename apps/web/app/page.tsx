"use client";

import { trpc } from "../trpc/client";

export default function Home() {
  const { data } = trpc.todos.getAllTodos.useQuery();
  console.log('Todos:', data);
  return (
    <div>Home Page</div>
  );
}
