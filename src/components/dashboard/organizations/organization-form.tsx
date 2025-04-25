"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useDialog } from '@/contexts/dialog-context'
import { Organization } from '@/db/schema'
import useOrganizationForm from '@/hooks/forms/use-org-form'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'

function OrganizationForm({ team }: { team?: Organization }) {
    const { form, onSubmit, isPending, isSuccess } = useOrganizationForm(team)
    const { setOpen } = useDialog()

    useEffect(() => {
        if (!isPending && isSuccess) {
            setOpen(false)
        }
    }, [isSuccess, isPending])

    useEffect(() => {
        if (team) {
            form.reset({
                name: team.name
            })
        }
    }, [team])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <FormControl>
                                <Input
                                    id="name"
                                    placeholder="Enter name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>)
                    }
                />
                <Button type="submit" className="w-full">
                    {isPending && <Loader2 className='animate-spin w-3 h-3' />}
                    <span>{team ? "Update organization" : "Save organization"}</span>
                </Button>
            </form>
        </Form>
    )
}

export default OrganizationForm
