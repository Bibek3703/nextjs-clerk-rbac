"use client"

import { Organization } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Organization>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    // {
    //     accessorKey: "amount",
    //     header: "Amount",
    // },
]
