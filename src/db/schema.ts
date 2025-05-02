import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type Role = "Admin" | "Member"

export const roleEnum = pgEnum("role", ["Admin", "Member"]);

// Users Table
export const users = pgTable("users", {
    id: text("id").notNull().primaryKey(),
    email: text("email").unique().notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    imageUrl: text("image_url"),
    role: roleEnum("role").default("Member").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Organizations Table
export const organizations = pgTable("organizations", {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    imageUrl: text("image_url"),
    membersCount: integer("members_count"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

// Organization to User Junction Table
export const organizationsToUsers = pgTable("organizations_to_users", {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type OrganizationToUser = typeof organizations.$inferSelect;
export type InsertOrganizationToUser = typeof organizations.$inferInsert;

// Todos Table
export const todos = pgTable("todos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    completed: boolean("completed").default(false).notNull(),
    dueDate: timestamp("due_date"),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    organizationId: text("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type Todo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;

// Labels Table
export const labels = pgTable("labels", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    color: text("color").default("#000000").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type Label = typeof labels.$inferSelect;
export type InsertLabel = typeof labels.$inferInsert;

// Todo to Label Junction Table
export const todosToLabels = pgTable("todos_to_labels", {
    id: uuid("id").primaryKey().defaultRandom(),
    todoId: uuid("todo_id").notNull().references(() => todos.id, { onDelete: "cascade" }),
    labelId: uuid("label_id").notNull().references(() => labels.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type TodoToLabel = typeof todosToLabels.$inferSelect;
export type InsertTodoToLabel = typeof todosToLabels.$inferInsert;

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