"use client"

import { Button } from '@/components/ui/button'
import { Organization } from '@/db/schema'
import { Table } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'
import React from 'react'
import { DialogTeam } from './team-dialog'
import { DialogProvider } from '@/contexts/dialog-context'

function HeaderComponent({ }: { table: Table<Organization> }) {
    return (
        <div className='flex items-center gap-3 p-2'>
            <h3 className='font-semibold'>Teams</h3>
            <div className='ml-auto'>
                <DialogProvider>
                    <DialogTeam
                        title="Team"
                        trigger={<Button size="sm">
                            <PlusCircle />
                            <span>Create Team</span>
                        </Button>}
                    />
                </DialogProvider>
            </div>
        </div>
    )
}

export default HeaderComponent
