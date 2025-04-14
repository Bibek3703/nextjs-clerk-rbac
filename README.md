# Building a Todo App with Next.js, Clerk, and NeonDB

This guide outlines the step-by-step process to build a full-stack todo application with:

- **Next.js** for frontend and backend
- **shadcn/ui** for the component library
- **Clerk** for authentication and authorization
- **NeonDB** (PostgreSQL) for database
- **Drizzle ORM** for database interactions
- **Role-based access control (RBAC)** with organization management
- **Email and Google OAuth** integration

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Authentication Setup with Clerk](#2-authentication-setup-with-clerk)
3. [Database Setup with NeonDB](#3-database-setup-with-neondb)
4. [Schema Design & Drizzle Integration](#4-schema-design--drizzle-integration)
5. [Organization & User Management](#5-organization--user-management)
6. [Role-Based Access Control Implementation](#6-role-based-access-control-implementation)
7. [Webhook Integration for Data Sync](#7-webhook-integration-for-data-sync)
8. [Todo Application Features](#8-todo-application-features)
9. [Frontend Implementation with shadcn/ui](#9-frontend-implementation-with-shadcnui)
10. [Deployment & Testing](#10-deployment--testing)

## 1. Project Setup

### Initialize Next.js project
```bash
npx create-next-app@latest todo-app
```

During setup, select:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- Import alias: Yes (default @/*)

### Install dependencies
```bash
cd todo-app
npm install @clerk/nextjs zod react-hook-form @hookform/resolvers next-themes
npm install drizzle-orm postgres @neondatabase/serverless
npm install -D drizzle-kit typescript @types/node @types/react
```

### Install and initialize shadcn/ui
```bash
npx shadcn@latest init
```

Select:
- Typography: Yes
- Color scheme: Default
- Global CSS: Yes
- CSS variables: Yes
- Tailwind plugin: Yes
- Base layer: Yes
- Utils: Yes
- Prefix: Leave default

### Install basic shadcn/ui components
```bash
npx shadcn@latest add button card form input toast dialog dropdown-menu separator
```

### Set up project structure
```
/app
  /api
    /webhooks
      /clerk
      /todos
    /organizations
    /auth
  /(routes)
    /auth
    /dashboard
    /organizations
    /settings
  /components
    /auth
    /dashboard
    /organizations
    /ui
  /lib
    /clerk
    /db
    /utils
    /hooks
/drizzle
  schema.ts
  migrations/
/public
```

## 2. Authentication Setup with Clerk

### Sign up for Clerk account
1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Configure authentication providers:
   - Email/password
   - Google OAuth

### Configure environment variables
Create `.env.local` file:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Next.js Quickstart (App Router)
[Next.js Quickstart (App Router)](https://clerk.com/docs/quickstarts/nextjs)

## 3. Database Setup with NeonDB

### Sign up for NeonDB
1. Create an account at [neon.tech](https://neon.tech)
2. Create a new project
3. Create a database

### Add database connection string to environment variables
Add to `.env` file:
```
DATABASE_URL="postgresql://username:password@endpoint:5432/todo_app?schema=public"
```

## 4. Schema Design & Drizzle Integration

### Create Drizzle schema
Create `drizzle/schema.ts`:

```typescript
import { pgTable, uuid, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["ADMIN", "USER"]);
export const permissionEnum = pgEnum("permission", [
  "CREATE_TODO",
  "UPDATE_TODO",
  "DELETE_TODO",
  "MANAGE_USERS",
  "MANAGE_ORGANIZATION"
]);

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  role: roleEnum("role").default("USER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Organizations Table
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Organization to User Junction Table
export const organizationsToUsers = pgTable("organizations_to_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// User Permissions Table
export const userPermissions = pgTable("user_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  permission: permissionEnum("permission").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Todos Table
export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  dueDate: timestamp("due_date"),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Labels Table
export const labels = pgTable("labels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  color: text("color").default("#000000").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Todo to Label Junction Table
export const todosToLabels = pgTable("todos_to_labels", {
  id: uuid("id").primaryKey().defaultRandom(),
  todoId: uuid("todo_id").notNull().references(() => todos.id, { onDelete: "cascade" }),
  labelId: uuid("label_id").notNull().references(() => labels.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
  organizations: many(organizationsToUsers),
  permissions: many(userPermissions)
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(organizationsToUsers),
  todos: many(todos),
  permissions: many(userPermissions)
}));

export const todosRelations = relations(todos, ({ one, many }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id]
  }),
  organization: one(organizations, {
    fields: [todos.organizationId],
    references: [organizations.id]
  }),
  labels: many(todosToLabels)
}));

export const labelsRelations = relations(labels, ({ many }) => ({
  todos: many(todosToLabels)
}));
```

### Create database connection utilities
Create `lib/db/index.ts`:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";

import * as schema from "@/drizzle/schema";

// Create a connection pool to NeonDB
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle with our schema
export const db = drizzle(sql, { schema });
```

### Create migration configuration
Create `drizzle.config.ts`:

```typescript
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### Generate and run migrations
```bash
# Generate migration
npx drizzle-kit generate

# You'll need a script to push migrations or run them manually for NeonDB
```

## 5. Organization & User Management

### Create organization management components
- Create organization creation form
- Implement organization settings page
- Build user invitation system

### Implement onboarding flow
- Create organization during first sign-up
- Assign default roles and permissions
- Guide through initial setup process

## 6. Role-Based Access Control Implementation

### Design permission system
- Define roles (Admin, User)
- Define permissions matrix
- Implement permission checking utilities

### Create RBAC middleware
- Implement permission verification
- Secure API endpoints with role checks
- Create UI components that adapt to permissions

## 7. Webhook Integration for Data Sync

### Configure Clerk webhooks
1. In Clerk Dashboard, set up webhooks for:
   - User creation
   - User updates
   - User deletion
   - Organization events

### Implement webhook handlers
Create webhook endpoint to sync data between Clerk and NeonDB

## 8. Todo Application Features

### Design core todo functionality
- Todo creation
- Todo updating
- Todo deletion
- Todo filtering and sorting
- Labeling system
- Due dates and reminders

### Implement API routes for todo operations
- Create API endpoints for CRUD operations
- Implement filtering and pagination
- Secure endpoints with proper auth checks

## 9. Frontend Implementation with shadcn/ui

### Create layout components
- Dashboard layout
- Navigation components
- Theme toggle

### Build todo interface
- Todo creation form
- Todo list view
- Todo detail view
- Filter and sorting UI

### Integrate organization management UI
- Organization switcher
- User management views
- Permission management

## 10. Deployment & Testing

### Testing
- Implement unit tests for critical functionality
- Perform integration testing
- Test authentication flows

### Deployment
- Prepare for production deployment
- Set up proper environment variables
- Deploy to Vercel or similar platform