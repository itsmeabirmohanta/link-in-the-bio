'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { ShieldX, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return 'You are not authorized to access this area. Only the site owner can access the admin dashboard.'
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.'
      case 'Verification':
        return 'The sign-in link is no longer valid. It may have been used already or it may have expired.'
      default:
        return 'An error occurred during authentication. Please try again.'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-500/20 via-transparent to-purple-500/20 dark:from-red-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-purple-500 rounded-full flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-br from-red-600 to-purple-600 bg-clip-text text-transparent">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            {getErrorMessage(error)}
          </p>
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 py-6"
              onClick={() => signIn('github', { callbackUrl: '/' })}
            >
              Try Again with GitHub
            </Button>
            <Link href="/" className="block">
              <Button
                variant="ghost"
                size="lg"
                className="w-full flex items-center justify-center gap-2 py-6"
              >
                <ArrowLeft className="w-5 h-5" />
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 