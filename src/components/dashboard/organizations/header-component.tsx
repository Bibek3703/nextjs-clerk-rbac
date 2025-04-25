"use client"

import { Button } from '@/components/ui/button'
import { Organization } from '@/db/schema'
import { Table } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import React from 'react'
import { DialogProvider } from '@/contexts/dialog-context'
import { DialogOrganization } from './org-dialog'

function HeaderComponent({ }: { table: Table<Organization> }) {
    return (
        <div className='flex items-center gap-3 p-2'>
            <h3 className='font-semibold'>Organizations</h3>
            <div className='ml-auto'>
                <DialogProvider>
                    <DialogOrganization
                        title="Organization"
                        trigger={<Button size="sm">
                            <PlusCircle />
                            <span>Add Organization</span>
                        </Button>}
                    />
                </DialogProvider>
            </div>
        </div>
    )
}

export default HeaderComponent
