"use client"

import { Organization } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import TeamActions from "./team-actions"

export const columns: ColumnDef<Organization>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "clerkOrgId",
        header: "ID",
    },
    {
        accessorKey: "membersCount",
        header: "Members",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const team = row.original

            return <TeamActions team={team} />
        },
    },
]
