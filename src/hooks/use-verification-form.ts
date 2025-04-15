"use client"

import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignUp } from '@clerk/clerk-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
    code: z.string().min(6, { message: "Password is required" }),
});

type VerificationFormPropsType = {
    redirectUrl: string
}

function useVerificationForm({ redirectUrl = "/" }: VerificationFormPropsType = { redirectUrl: "/" }) {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [verifying, setVerifying] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!isLoaded) return

        setLoading(true)

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                ...values,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                if (redirectUrl) {
                    router.push(redirectUrl)
                }
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            // console.error(JSON.stringify(err, null, 2))
            toast.error(JSON.stringify(err?.message || "Something went wrong", null, 2))
        } finally {
            setLoading(false)
        }
    }


    return {
        form,
        onSubmit,
        verifying,
        loading
    }
}

export default useVerificationForm
