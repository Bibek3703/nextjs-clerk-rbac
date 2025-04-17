"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateTeam, useUpdateTeam } from '../use-teams';
import { Organization } from '@/db/schema';
import { useAuth } from '@clerk/nextjs';

const formSchema = z.object({
    name: z.string().min(1, { message: "Team name is required" }),
});

function useTeamForm(team?: Organization) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const { mutate: createTeam, isPending: createIsPending, isSuccess: createIsSuccess } = useCreateTeam();
    const { mutate: updateTeam, isPending: updateIsPending, isSuccess: updateIsSuccess } = useUpdateTeam();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (team) {
            await updateTeam({ organizationId: team.clerkOrgId, organization: { ...values, clerkId: team.clerkId } as Organization })
        } else {

            await createTeam(values as Organization)
        }
    }


    return {
        form,
        onSubmit,
        isPending: createIsPending || updateIsPending,
        isSuccess: createIsSuccess || updateIsSuccess
    }
}

export default useTeamForm
