'use client'

import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the error content with no SSR
const ErrorContent = dynamic(() => import('./ErrorContent'), {
  ssr: false,
  loading: () => (
    <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl">
      <CardContent className="p-8">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </CardContent>
    </Card>
  ),
})

export default function AuthError() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-500/20 via-transparent to-purple-500/20 dark:from-red-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      <ErrorContent />
    </main>
  )
} 