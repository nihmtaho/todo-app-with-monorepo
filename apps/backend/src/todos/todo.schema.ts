import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  completed: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  dueDate: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export const createTodoSchema = TodoSchema.omit({
  id: true,
  createdAt: true,
});

export const updateTodoSchema = createTodoSchema.partial().extend({
  id: z.string(),
  updatedAt: z.date().default(() => new Date()),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type Todo = z.infer<typeof TodoSchema>;
