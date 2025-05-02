import SignInForm from '@/components/auth/signin-form'
import React from 'react'

function SignInPage() {
    return (
        <div className='w-full'>
            <SignInForm />
            {/* <div id="clerk-captcha" className="w-auto mx-auto mt-6" /> */}
        </div>
    )
}

export default SignInPage
