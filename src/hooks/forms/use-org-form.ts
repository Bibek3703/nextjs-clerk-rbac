"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Organization } from '@/db/schema';
import { useCreateOrganization, useUpdateOrganization } from '../use-organizations';
import { useAuth } from '@clerk/nextjs';

const formSchema = z.object({
    name: z.string().min(1, { message: "Organization name is required" }),
});

function useOrganizationForm(organization?: Organization) {
    const { userId } = useAuth()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const { mutate: createOrganization, isPending: createIsPending, isSuccess: createIsSuccess } = useCreateOrganization(userId);
    const { mutate: updateOrganization, isPending: updateIsPending, isSuccess: updateIsSuccess } = useUpdateOrganization(userId);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!userId) return
        if (organization) {
            updateOrganization({ id: organization.id, ...values } as Organization)
        } else {
            createOrganization(values as Organization)
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
