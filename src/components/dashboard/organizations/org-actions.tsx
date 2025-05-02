"use client"

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, MoreHorizontal, Trash2, View } from 'lucide-react'
import { Organization } from '@/db/schema'
import { DialogProvider, useDialog } from '@/contexts/dialog-context'
import { useDeleteOrganization } from '@/hooks/use-organizations'
import { DialogOrganization } from './org-dialog'
import { useAuth } from '@clerk/nextjs'


function OrganizationActions({ team }: { team: Organization }) {
    const { userId } = useAuth()
    const { setOpen } = useDialog()
    const { mutate: deleteOrganization, isPending, isSuccess } = useDeleteOrganization(userId)

    useEffect(() => {
        if (!isPending && isSuccess) {
            setOpen(false)
        }
    }, [isPending, isSuccess])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <DialogProvider>
                        <DialogOrganization
                            team={team}
                            title="Organization"
                            trigger={<Button variant="ghost" size="sm">
                                <View />
                                <span>View Organization</span>
                            </Button>}
                        />
                    </DialogProvider>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant="ghost" size="sm" onClick={() => deleteOrganization(team.id)}>
                        {isPending ? <Loader2 className='animate-spin w-3 h-3' /> : <Trash2 className='text-destructive' />}
                        <span>Delete Organization</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default OrganizationActions
