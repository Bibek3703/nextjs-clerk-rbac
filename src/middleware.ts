import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
    '/(protected)(.*)',
    '/dashboard(.*)',
    '/organizations(.*)',
    '/settings(.*)',
]);

const isAuthRoute = createRouteMatcher([
    '/(auth)(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    if (!userId && isProtectedRoute(req)) return redirectToSignIn({ returnBackUrl: req.url })



    if (userId && isAuthRoute(req)) {
        const onboardingUrl = new URL('/dashboard', req.url)
        return NextResponse.redirect(onboardingUrl)
    }

    if (userId && isProtectedRoute(req)) await auth.protect();
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}