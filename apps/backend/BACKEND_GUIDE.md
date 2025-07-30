# Hướng Dẫn Backend - Todo App

## Tổng Quan Kiến Trúc

Backend của Todo App được xây dựng bằng **NestJS** kết hợp với **nestjs-trpc** để cung cấp API theo kiểu RPC (Remote Procedure Call). Điều này cho phép frontend gọi các function trực tiếp thay vì sử dụng REST API truyền thống.

### Công Nghệ Sử Dụng

- **NestJS**: Framework Node.js mạnh mẽ, sử dụng TypeScript và áp dụng kiến trúc modular
- **nestjs-trpc**: Tích hợp tRPC vào NestJS để tạo type-safe APIs
- **Zod**: Thư viện validation và schema definition
- **TypeScript**: Đảm bảo type safety trong toàn bộ ứng dụng

## Cấu Trúc Thư Mục

```text
apps/backend/
├── src/
│   ├── app.module.ts          # Module gốc của ứng dụng
│   ├── main.ts                # Entry point, khởi động server
│   └── todos/                 # Module quản lý Todo
│       ├── todos.module.ts    # Module definition
│       ├── todos.service.ts   # Business logic
│       ├── todo.router.ts     # API endpoints (tRPC router)
│       └── todo.schema.ts     # Data validation schemas
├── test/                      # End-to-end tests
├── package.json               # Dependencies và scripts
└── nest-cli.json             # NestJS CLI configuration
```

## Chi Tiết Từng File

### 1. `main.ts` - Entry Point

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**Chức năng:**

- Khởi tạo ứng dụng NestJS từ `AppModule`
- Khởi động server trên port 3000 (hoặc port từ biến môi trường)

### 2. `app.module.ts` - Module Gốc

```typescript
@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile: '../../packages/trpc/src/server',
    }),
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

**Chức năng:**

- Cấu hình tRPC module với auto-generation schema
- Import `TodosModule` để sử dụng các chức năng Todo
- Là module chính điều phối toàn bộ ứng dụng

### 3. `todo.schema.ts` - Data Validation

```typescript
export const TodoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  completed: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  dueDate: z.preprocess(...).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});
```

**Chức năng:**

- Định nghĩa schema cho Todo object với các validation rules
- Tạo derived schemas: `createTodoSchema`, `updateTodoSchema`
- Export TypeScript types từ Zod schemas
- Đảm bảo data integrity và type safety

### 4. `todos.service.ts` - Business Logic

Đây là nơi chứa toàn bộ logic nghiệp vụ của Todo:

```typescript
@Injectable()
export class TodosService {
  private todos: Todo[] = []; // In-memory storage (demo purposes)

  // Các methods:
  - getTodoById(id: string): Lấy todo theo ID
  - getAllTodos(): Lấy tất cả todos
  - createTodo(todoData): Tạo todo mới
  - updateTodo(id, data): Cập nhật todo
  - deleteTodo(id): Xóa todo
}
```

**Đặc điểm:**

- Sử dụng in-memory storage (array) để demo
- Trong production, sẽ thay thế bằng database (MongoDB, PostgreSQL, etc.)
- Xử lý error handling khi không tìm thấy todo
- Generate ID ngẫu nhiên cho todo mới

### 5. `todo.router.ts` - API Endpoints

```typescript
@Router({ alias: 'todos' })
export class TodoRouter {
  constructor(private readonly todosService: TodosService) {}

  @Query({ input: ..., output: ... })
  getTodoById(@Input('id') id: string) { ... }

  @Mutation({ input: ..., output: ... })
  createTodo(@Input() todoData: CreateTodoInput) { ... }
}
```

**Đặc điểm:**

- `@Router({ alias: 'todos' })`: Tạo namespace 'todos' cho API
- `@Query`: Cho operations đọc dữ liệu (GET)
- `@Mutation`: Cho operations thay đổi dữ liệu (POST, PUT, DELETE)
- Type-safe với input/output validation using Zod schemas

### 6. `todos.module.ts` - Module Definition

```typescript
@Module({
  providers: [TodosService, TodoRouter],
})
export class TodosModule {}
```

**Chức năng:**

- Đăng ký `TodosService` và `TodoRouter` làm providers
- NestJS sẽ tự động inject dependencies

## Luồng Hoạt Động

### 1. Tạo Todo Mới

```text
Frontend → TodoRouter.createTodo() → TodosService.createTodo() → Trả về Todo object
```

### 2. Lấy Danh Sách Todo

```text
Frontend → TodoRouter.getAllTodos() → TodosService.getAllTodos() → Trả về Todo[]
```

### 3. Cập Nhật Todo

```text
Frontend → TodoRouter.updateTodo() → TodosService.updateTodo() → Trả về Todo updated
```

## Các Scripts Quan Trọng

```bash
# Khởi động development server với hot-reload
pnpm run dev

# Build production
pnpm run build

# Chạy production
pnpm run start:prod

# Testing
pnpm run test        # Unit tests
pnpm run test:e2e    # End-to-end tests
pnpm run test:cov    # Coverage report

# Linting và formatting
pnpm run lint
pnpm run format
```

## tRPC Integration

### Ưu Điểm của tRPC

1. **Type Safety**: Tự động sync types giữa frontend và backend
2. **No Code Generation**: Không cần generate API client
3. **IntelliSense**: Full autocomplete và error checking
4. **Lightweight**: Nhẹ hơn GraphQL, đơn giản hơn REST

### Cách Frontend Gọi API

```typescript
// Thay vì fetch('/api/todos'), frontend sẽ gọi:
const todos = await trpc.todos.getAllTodos.query();
const newTodo = await trpc.todos.createTodo.mutate(todoData);
```

## Mở Rộng Trong Tương Lai

### 1. Database Integration

```typescript
// Thay thế in-memory storage bằng database
@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}
}
```

### 2. Authentication & Authorization

```typescript
// Thêm guards cho bảo mật
@UseGuards(JwtAuthGuard)
@Router({ alias: 'todos' })
export class TodoRouter { ... }
```

### 3. Caching

```typescript
// Thêm Redis cache
@Injectable()
export class TodosService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
}
```

### 4. Validation Middleware

```typescript
// Thêm custom validation pipes
@Mutation({
  input: createTodoSchema,
  output: TodoSchema,
})
createTodo(@Input() todoData: CreateTodoInput) {
  // Validation sẽ tự động chạy
}
```

## Best Practices

1. **Separation of Concerns**: Logic nghiệp vụ trong Service, API handling trong Router
2. **Schema-First Design**: Định nghĩa schemas trước, sau đó implement logic
3. **Error Handling**: Luôn xử lý errors và trả về messages có ý nghĩa
4. **Type Safety**: Sử dụng TypeScript và Zod để đảm bảo type safety
5. **Testing**: Viết tests cho cả unit và integration
6. **Documentation**: Comment code và maintain README

## Troubleshooting

### Common Issues

1. **Port already in use**:

   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **TypeScript errors**:

   ```bash
   # Rebuild TypeScript
   pnpm run build
   ```

3. **Module not found**:

   ```bash
   # Reinstall dependencies
   pnpm install
   ```

## Kết Luận

Backend của Todo App sử dụng kiến trúc modular của NestJS kết hợp với tRPC để tạo ra một API type-safe, dễ maintain và scale. Cấu trúc rõ ràng giúp dễ dàng thêm features mới và debug khi có vấn đề.

Để hiểu sâu hơn, hãy thử:

1. Chạy backend và test các API endpoints
2. Thêm validation rules mới vào schemas
3. Tạo thêm endpoints cho features khác
4. Viết unit tests cho các services
