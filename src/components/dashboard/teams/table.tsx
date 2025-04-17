"use client"
import React from 'react'
import { DataTable } from '../data-table'
import TableHeader from './header-component'
import { Table } from '@tanstack/react-table'
import { Organization } from '@/db/schema'
import { columns } from './columns'
import { useTeams } from '@/hooks/use-teams'
import { useAuth } from '@clerk/nextjs'

function TeamDataTable() {
    const { userId } = useAuth()
    const { data } = useTeams(userId)

    const renderHeaderComponent = (table: Table<Organization>) => {
        return <TableHeader table={table} />
    }

    return (
        <DataTable
            columns={columns}
            data={data || []}
            headerComponent={renderHeaderComponent}
        />
    )
}

export default TeamDataTable
