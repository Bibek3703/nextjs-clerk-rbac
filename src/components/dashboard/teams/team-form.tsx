"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useTeamForm from '@/hooks/forms/use-team-form'
import { Loader2 } from 'lucide-react'
import React from 'react'

function TeamForm() {
    const { form, onSubmit, isPending } = useTeamForm()

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
                    <span>Save</span>
                </Button>
            </form>
        </Form>
    )
}

export default TeamForm
