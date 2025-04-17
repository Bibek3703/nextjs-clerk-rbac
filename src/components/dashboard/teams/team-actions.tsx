"use client"

import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, MoreHorizontal, Trash2, View } from 'lucide-react'
import { Organization } from '@/db/schema'
import { DialogProvider, useDialog } from '@/contexts/dialog-context'
import { DialogTeam } from './team-dialog'
import { useDeleteTeam } from '@/hooks/use-teams'
import { useAuth } from '@clerk/nextjs'


function TeamActions({ team }: { team: Organization }) {
    const { userId } = useAuth()
    const { setOpen } = useDialog()
    const { mutate: deleteTeam, isPending, isSuccess } = useDeleteTeam()

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
                        <DialogTeam
                            team={team}
                            title="Team"
                            trigger={<Button variant="ghost" size="sm">
                                <View />
                                <span>View Team</span>
                            </Button>}
                        />
                    </DialogProvider>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button variant="ghost" size="sm" onClick={() => deleteTeam(team.clerkOrgId)}>
                        {isPending ? <Loader2 className='animate-spin w-3 h-3' /> : <Trash2 className='text-destructive' />}
                        <span>Delete Team</span>
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TeamActions
