import SignUpForm from '@/components/auth/signup-form'
import React from 'react'

function SignUpPage() {
    return (
        <div className='w-full'>
            <SignUpForm />
            {/* <div id="clerk-captcha" className="w-auto mx-auto mt-6" /> */}
        </div>
    )
}

export default SignUpPage
