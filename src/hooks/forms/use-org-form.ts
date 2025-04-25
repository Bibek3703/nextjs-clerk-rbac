"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Organization } from '@/db/schema';
import { useCreateOrganization, useUpdateOrganization } from '../use-organizations';

const formSchema = z.object({
    name: z.string().min(1, { message: "Organization name is required" }),
});

function useOrganizationForm(team?: Organization) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const { mutate: createOrganization, isPending: createIsPending, isSuccess: createIsSuccess } = useCreateOrganization();
    const { mutate: updateOrganization, isPending: updateIsPending, isSuccess: updateIsSuccess } = useUpdateOrganization();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (team) {
            await updateOrganization({ organizationId: team.clerkOrgId, organization: { ...values, clerkId: team.clerkId } as Organization })
        } else {

            await createOrganization(values as Organization)
        }
    }


    return {
        form,
        onSubmit,
        isPending: createIsPending || updateIsPending,
        isSuccess: createIsSuccess || updateIsSuccess
    }
}

export default useOrganizationForm
