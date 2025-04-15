"use client"

import React from 'react';
import { toast } from 'sonner';
import { useSignIn } from '@clerk/clerk-react';
import { OAuthStrategy } from '@clerk/types';


function useOauthSignIn() {
    const { signIn } = useSignIn()
    const [loading, setLoading] = React.useState(false)

    const signInWith = (strategy: OAuthStrategy) => {
        if (!signIn) return null

        try {
            return signIn
                .authenticateWithRedirect({
                    strategy,
                    redirectUrl: '/sso-callback',
                    redirectUrlComplete: '/dashboard',
                })
                .then((res) => {
                    console.log(res)
                })
                .catch((err: any) => {
                    // See https://clerk.com/docs/custom-flows/error-handling
                    // for more info on error handling
                    console.log(err.errors)
                    console.error(err, null, 2)
                })
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
        loading,
        signInWith
    }
}

export default useOauthSignIn
