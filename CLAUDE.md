# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses **pnpm** (not npm)

- **Dev server**: `pnpm run dev` - Starts Vite development server
- **Build**: `pnpm run build` - TypeScript compilation + Vite build
- **Lint**: `pnpm run lint` - Check code with Biome
- **Lint fix**: `pnpm run lint:fix` - Auto-fix linting issues
- **Format**: `pnpm run format:write` - Format code with Biome
- **Check all**: `pnpm run check:fix` - Run all Biome checks and fixes
- **Preview**: `pnpm run preview` - Preview production build

## Tech Stack & Architecture

### Core Technologies
- **React 19** with TypeScript
- **Vite** for build tooling
- **TanStack Router** with file-based routing and code splitting
- **TanStack Query** for server state management
- **Zustand** for client state management (auth store)
- **React Hook Form** for form management with Zod validation
- **Mantine UI** components with dark theme default
- **Biome** for linting and formatting
- **Axios** for HTTP requests

### Project Structure
```
src/
├── pages/          # File-based routing (auto-generated routeTree.gen.ts)
│   ├── __root.tsx  # Root layout with auth guards
│   ├── _private/   # Protected routes
│   └── _public/    # Public routes (Login)
├── stores/         # Zustand stores (useAuthStore)
├── config/         # App configuration (axios, query, constants)
├── services/       # API service functions
├── models/         # TypeScript types and Zod schemas
├── hooks/          # Custom hooks
└── components/     # Reusable UI components
```

### Path Aliases (configured in vite.config.ts)
- `@/` → `src/`
- `@services/` → `src/services/`
- `@models/` → `src/models/`
- `@hooks/` → `src/hooks/`
- `@config/` → `src/config/`
- `@components/` → `src/components/`
- `@stores/` → `src/stores/`

### Authentication Flow
- **Dual verification system**: Login state + admin data validation
- **Zustand store**: Persists only `isAuth` boolean to localStorage
- **Route guards**:
  - `__root.tsx` handles initial redirects
  - `_private.tsx` validates auth + fetches admin data
  - Auto-logout on API failures
- **Login flow**: DNI + password → set auth state → redirect to Dashboard

### Routing Architecture
- **File-based routing** with TanStack Router
- **Auto code splitting** enabled
- **Context-aware**: Router receives auth state and admin data
- **Protected routes**: `_private/` directory requires authentication
- **Public routes**: `_public/` directory (Login page)

### Key Features
- **Spanish locale** for dates (dayjs)
- **Mantine DataTable** for data display
- **Form validation** with React Hook Form + Zod schemas
- **Notifications** system with Mantine
- **Responsive design** with Mantine Grid

### Development Patterns
- **Co-located files**: Page-specific services/models/hooks in same directory
- **Barrel exports**: `index.ts` files for clean imports
- **Type safety**: Strict TypeScript with Zod runtime validation
- **Error boundaries**: Built into TanStack Router
- **Query invalidation**: Automatic on auth state changes

### Schema Naming Conventions
**Zod Import**: Always import Zod from v4:
```typescript
import { z } from 'zod/v4';
```

**Zod Schema Naming Pattern**:
- **Single entity schemas**: `{Entity}Schema` (e.g., `UserSchema`, `ClientSchema`)
- **Array schemas**: `List{Entity}Schema` (e.g., `ListUsersSchema`, `ListClientsSchema`)
  - IMPORTANT: Use plural form (e.g., `ListUsersSchema` NOT `ListUserSchema`)
  - NEVER use inline `z.array()` without naming it
- **Response schemas**: `List{Entity}ResponseSchema` (e.g., `ListUsersResponseSchema`, `ListClientsResponseSchema`)
- **Request schemas**: `{Action}{Entity}RequestSchema` (e.g., `CreateUserRequestSchema`, `UpdateClientRequestSchema`)
- **Query schemas**: `{Entity}QueryParamsSchema` and `{Entity}SortBySchema` (e.g., `UsersQueryParamsSchema`, `UserSortBySchema`)

**Examples**:
```typescript
import { z } from 'zod/v4';

const UserSchema = z.object({ id: z.string(), name: z.string() });
const ListUsersSchema = z.array(UserSchema);
const ListUsersResponseSchema = ResponseGenericIncludeDataSchema(ListUsersSchema);
const CreateUserRequestSchema = UserSchema.omit({ id: true });
```

### Page Models Organization
For modules in `src/pages/_private/**/models/`, follow this structure:

**File Structure**:
```
-models/
├── {domain}.type.ts       # Main entity schemas, CRUD schemas, response schemas
├── query.type.ts          # Query params and sort schemas (MUST be separate)
└── index.ts               # Barrel exports
```

**Main Type File** (`{domain}.type.ts`):
- Entity schema definition
- CRUD request/response schemas
- List schemas
- Response schemas
- NO query schemas (move to query.type.ts)

**Query Type File** (`query.type.ts`):
- Import entity schema from main file
- `{Domain}SortBySchema` - enum for sortable fields
- `{Domain}QueryParamsSchema` - extends `GenericQueryParamsSchema`
- Query-related types only

**Example Structure**:
```typescript
// user.type.ts
import { z } from 'zod/v4';
import { ResponseGenericIncludeDataSchema } from '@/models';

export const UserSchema = z.object({ id: z.string(), name: z.string() });
const ListUsersSchema = z.array(UserSchema);
const ListUsersResponseSchema = ResponseGenericIncludeDataSchema(ListUsersSchema);
const CreateUserRequestSchema = UserSchema.omit({ id: true });

export { ListUsersResponseSchema, CreateUserRequestSchema };
export type { ListUsersResponse, CreateUserRequest };

// query.type.ts
import { z } from 'zod/v4';
import { GenericQueryParamsSchema } from '@/models';
import { UserSchema } from './user.type';

const UserSortBySchema = z.enum(
  Object.keys(UserSchema.shape) as [keyof typeof UserSchema.shape, ...Array<keyof typeof UserSchema.shape>]
);
const UsersQueryParamsSchema = GenericQueryParamsSchema(UserSortBySchema).extend({
  name: z.string().optional(),
});

export { UsersQueryParamsSchema };
export type { UsersQueryParams, UserSortBy };

// index.ts
export * from './user.type';
export * from './query.type';
```