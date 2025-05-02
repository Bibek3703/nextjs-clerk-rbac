"use client"
import React from 'react'
import TableHeader from './header-component'
import { Table } from '@tanstack/react-table'
import { Organization } from '@/db/schema'
import { columns } from './columns'
import { useAuth } from '@clerk/nextjs'
import { useOrganizations } from '@/hooks/use-organizations'
import { DataTable } from '../data-table'

function OrgDataTable() {
    const { userId } = useAuth()
    const { data, isLoading, isFetching } = useOrganizations(userId)

    const renderHeaderComponent = (table: Table<Organization>) => {
        return <TableHeader table={table} />
    }

    return (
        <DataTable
            columns={columns}
            data={data?.organizations || []}
            headerComponent={renderHeaderComponent}
            isLoading={isFetching || isLoading}
        />
    )
}

export default OrgDataTable
