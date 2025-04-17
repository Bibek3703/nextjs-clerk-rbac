"use client"
import React from 'react'
import { DataTable } from '../data-table'
import TableHeader from './header-component'
import { Table } from '@tanstack/react-table'
import { Organization } from '@/db/schema'
import { columns } from './columns'

function TeamDataTable() {

    const renderHeaderComponent = (table: Table<Organization>) => {
        return <TableHeader table={table} />
    }

    return (
        <DataTable
            columns={columns}
            data={[]}
            headerComponent={renderHeaderComponent}
        />
    )
}

export default TeamDataTable
