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
5. [Webhook Integration for Data Sync](#7-webhook-integration-for-data-sync)
6. [Deployment & Testing](#10-deployment--testing)

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
npm install drizzle-orm @neondatabase/serverless dotenv
npm install -D drizzle-kit tsx
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
  /(auth)
    /sign-in
      /[[...sign-in]]
      /[[...sign-up]]
  /(protected)
    /dashboard
    /teams
    /settings
    /todos
  /components
    /auth
    /dashboard
    /ui
  /db
    /schema.ts
    /index.ts
  /lib
    utils.ts
/public
drizzle.config.ts
package.json
tsconfig.json
```

## 2. Authentication Setup with Clerk
### Sign up for Clerk account

- Create an account at clerk.com
- Create a new application
- Configure authentication providers:
  - Email/password
  - Google OAuth



### Configure environment variables
- Create .env.local file:

```

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

```

### [Next.js Quickstart (App Router)](https://clerk.com/docs/quickstarts/nextjs)

### [Configure the session token](https://clerk.com/docs/references/nextjs/basic-rbac#configure-the-session-token)

### [Create a global TypeScript definition](https://clerk.com/docs/references/nextjs/basic-rbac#create-a-global-type-script-definition)

```typescript
  import { roles } from "@/db/schema"

  export { }

  // Create a type for the roles
  export type Roles = typeof roles

  declare global {
      interface CustomJwtSessionClaims {
          metadata: {
              role?: Roles,
          }
      }
  }
```

## 3. Database Setup with NeonDB

### Sign up for NeonDB

- Create an account at neon.tech
- Create a new project
- Create a database

### Add database connection string to environment variables
 Add to .env file:
  ```
  DATABASE_URL="postgresql://username:password@endpoint:5432/todo_app?schema=public"
  ```

## 4. Schema Design & Drizzle Integration
  #### Create a src/db/index.ts file in your src/db folder and set up your database configuration:
  ```typescript
    import { neon } from '@neondatabase/serverless';
    import { drizzle } from 'drizzle-orm/neon-http';

    const sql = neon(process.env.DATABASE_URL!);
    export const db = drizzle({ client: sql });
  ```

  #### Create a drizzle.config.ts file in the root of your project and add the following content:
  ```typescript
    import 'dotenv/config';
    import { defineConfig } from 'drizzle-kit';

    export default defineConfig({
        out: './drizzle',
        schema: './src/db/schema.ts',
        dialect: 'postgresql',
        dbCredentials: {
            url: process.env.DATABASE_URL!,
        },
    });
  ```

  #### Create Drizzle schema src/db/schema.ts file
  ```typescript
    import { relations } from "drizzle-orm";
    import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

    export const roles = ["Admin", "Member"] as const

    export const roleEnum = pgEnum("role", roles);

    // Users Table
    export const users = pgTable("users", {
        id: uuid("id").primaryKey().defaultRandom(),
        clerkId: text("clerk_id").unique().notNull(),
        email: text("email").unique().notNull(),
        firstName: text("first_name"),
        lastName: text("last_name"),
        imageUrl: text("image_url"),
        role: roleEnum("role").default("Member").notNull(),
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
    }));

    export const organizationsRelations = relations(organizations, ({ many }) => ({
        users: many(organizationsToUsers),
        todos: many(todos),
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


  #### [Applying changes to the database](https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon#applying-changes-to-the-database)

  #### See more:
  [Get Started with Drizzle and Neon](https://orm.drizzle.team/docs/get-started/neon-new)

  ####

## 5. Webhook Integration for Data Sync
  ### 1. [Set up ngrok](https://clerk.com/docs/webhooks/sync-data#set-up-ngrok)
  ### 2. [Set up a webhook endpoint](https://clerk.com/docs/webhooks/sync-data#set-up-a-webhook-endpoint)
  [Create Endpoints](/create_endpoints.png)
  ### 3. [Add your Signing Secret to .env](https://clerk.com/docs/webhooks/sync-data#add-your-signing-secret-to-env)
  ```.env
    CLERK_WEBHOOK_SIGNING_SECRET=whsec_123
  ```
  ### 4. [Make sure the webhook route is public](https://clerk.com/docs/webhooks/sync-data#make-sure-the-webhook-route-is-public)
  ### 5. [Install svix](https://clerk.com/docs/webhooks/sync-data#make-sure-the-webhook-route-is-public)
  ```npm
    npm install svix
  ```
  ### 6. [Create a route handler to verify the webhook](https://clerk.com/docs/webhooks/sync-data#create-a-route-handler-to-verify-the-webhook)
  ```typescript
    import { Webhook } from "svix";
    import { headers } from "next/headers";
    import { UserJSON, WebhookEvent } from "@clerk/nextjs/server";
    import { NextRequest, NextResponse } from "next/server";
    import { createUser } from "@/lib/actions/db/users";

    export async function POST(req: NextRequest) {
        const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET || "";

        if (!SIGNING_SECRET) {
            console.error("Error: Missing signing secret");
            return NextResponse.json({ message: "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local" }, {
                status: 400,
            });
        }

        // Get headers
        const headerPayload = await headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        // If there are no headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error("Error: Missing Svix headers");
            return NextResponse.json({ message: "Error: Missing Svix headers" }, {
                status: 400,
            });
        }

        // Get body
        const payloadString = await req.text();

        let evt: WebhookEvent;

        // Create new Svix instance with secret
        const wh = new Webhook(SIGNING_SECRET);

        // Verify payload with headers
        try {
            evt = wh.verify(payloadString, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            console.error("Error: Could not verify webhook:", err);
            return NextResponse.json({ message: "Error: Verification error" }, {
                status: 400,
            });
        }
        // Do something with payload
        // For this guide, log payload to console
        const { id } = evt.data;
        const eventType = evt.type;
        try {

            console.log("eventType", eventType);
            console.log("id", id);
            switch (eventType) {
                case "user.created": {
                    if (id) {
                        const clerkUser = evt.data as UserJSON & { profile_image_url: string };
                        await createUser({
                            clerkId: clerkUser.id,
                            email: clerkUser.email_addresses[0].email_address,
                            firstName: clerkUser?.first_name || "",
                            lastName: clerkUser?.last_name || "",
                            imageUrl: clerkUser?.image_url || "",
                        })
                        break;
                    }
                }
                case "user.updated": {
                    if (id) {
                        const clerkUser = evt.data as UserJSON & { profile_image_url: string };
                        break;
                    }
                }
                case "user.deleted": {
                    if (id) {
                        console.log(`Deleting user with ID ${id}`);
                        break;
                    }
                }
                default:
                    console.log(
                        `Received webhook with ID ${id} and event type of ${eventType}`,
                    );
                    console.log(
                        `Received Data: ${JSON.stringify(evt.data, null, 2)}`,
                    );
                    break;
            }
        } catch (err) {
            console.error("Error: Webhook action:", err);
            return NextResponse.json({ message: "Error: Something went wrong!" }, {
                status: 500,
            });
        }

        // console.log('Webhook payload:', payloadString)
        return NextResponse.json({ message: "Webhook received" }, { status: 200 });
    }

  ```