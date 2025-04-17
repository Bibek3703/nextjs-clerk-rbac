"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import TeamForm from "./team-form"
import { DialogProvider, useDialog } from "@/contexts/dialog-context"
import { Organization } from "@/db/schema"

type DialogTeamProps = {
    team?: Organization,
    title: string,
    description?: string,
    trigger: React.ReactNode | string,
}

export function DialogTeam({ team, title, description, trigger }: DialogTeamProps) {
    const { open, setOpen } = useDialog()
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] pb-0">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>
                        {description}
                    </DialogDescription>}
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <TeamForm team={team} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
