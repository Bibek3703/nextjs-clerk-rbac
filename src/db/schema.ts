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