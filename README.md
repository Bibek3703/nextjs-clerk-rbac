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
  /(auth)
    /sign-in
      /[[...sign-in]]
      /[[...sign-up]]
  /(protected)
    /onboarding
    /dashboard
    /organizations
    /settings
    /todos
  /components
    /ui
  /lib
    utils.ts
/public
```