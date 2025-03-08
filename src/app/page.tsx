'use client'

import { Card } from '@/components/ui/card'
import { ProfileCard } from '@/components/ProfileCard'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 dark:from-purple-900/10 dark:to-blue-900/10 flex items-center justify-center p-4 relative">
      {/* Polka dot background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      
      {/* Main content */}
      <div className="w-full max-w-md relative">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl overflow-hidden">
          <ProfileCard isAdmin={session?.user?.isAdmin ?? false} />
        </Card>
      </div>
    </main>
  )
}
