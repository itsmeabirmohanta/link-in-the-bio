'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { Github } from 'lucide-react'

export default function SignIn() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Github className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Sign in with GitHub to access your admin dashboard and manage your link-in-bio settings.
          </p>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 py-6"
            onClick={() => signIn('github', { callbackUrl: '/' })}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            Only authorized administrators can access this area.
          </p>
        </CardContent>
      </Card>
    </main>
  )
} 