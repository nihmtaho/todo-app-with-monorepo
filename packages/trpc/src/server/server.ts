import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  todos: t.router({
    getTodoById: publicProcedure.input(z.object({ id: z.string() })).output(z.object({
      id: z.string(),
      title: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      completed: z.boolean().default(false),
      createdAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      dueDate: z.date().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getAllTodos: publicProcedure.output(z.array(z.object({
      id: z.string(),
      title: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      completed: z.boolean().default(false),
      createdAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      dueDate: z.date().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createTodo: publicProcedure.input(z.object({
      id: z.string(),
      title: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      completed: z.boolean().default(false),
      createdAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      dueDate: z.date().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    }).omit({
      id: true,
      createdAt: true,
    })).output(z.object({
      id: z.string(),
      title: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      completed: z.boolean().default(false),
      createdAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      dueDate: z.date().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateTodo: publicProcedure.input(z.object({
      id: z.string(),
      data: z.object({
        id: z.string(),
        title: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        completed: z.boolean().default(false),
        createdAt: z.date().default(() => new Date()),
        updatedAt: z.date().default(() => new Date()),
        dueDate: z.date().optional(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
      }).omit({
        id: true,
        createdAt: true,
      }).partial().extend({
        id: z.string(),
        updatedAt: z.date().default(() => new Date()),
      }),
    })).output(z.object({
      id: z.string(),
      title: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      completed: z.boolean().default(false),
      createdAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      dueDate: z.date().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteTodo: publicProcedure.input(z.object({ id: z.string() })).output(z.boolean()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

