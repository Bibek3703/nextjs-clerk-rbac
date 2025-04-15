"use client"
import { Button } from "@/components/ui/button"
import { LogInIcon, UserPlus2 } from "lucide-react"
import Link from "next/link"

const Navbar = () => {
    return (
        <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                <h1 className="text-base font-bold md:text-2xl">ToDo</h1>
            </div>
            <div className="flex-0 flex items-center gap-2">
                <Button variant="secondary" className="transform rounded-lg font-medium transition-all duration-300 md:w-32" asChild>
                    <Link href="/sign-in">
                        <LogInIcon className="mr-2 h-4 w-4" />
                        <span className="hidden md:block">Sign in</span>
                    </Link>
                </Button>
                <Button className="transform rounded-lg font-medium transition-all duration-300 md:w-32" asChild>
                    <Link href="/sign-up">
                        <UserPlus2 className="mr-2 h-4 w-4" />
                        <span className="hidden md:block">Sign up</span>
                    </Link>
                </Button>
            </div>
        </nav>
    )
}

export default Navbar