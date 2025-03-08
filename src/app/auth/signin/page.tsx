'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { encrypt } from '@/lib/crypto'
import { validatePassword, type PasswordStrength } from '@/lib/validation'

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (password) {
      setPasswordStrength(validatePassword(password))
    } else {
      setPasswordStrength(null)
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const encryptedPassword = encrypt(password)
      
      // Check against environment variables
      if (username === process.env.NEXT_PUBLIC_ADMIN_USERNAME &&
          encryptedPassword === encrypt(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '')) {
        // Store auth state
        if (rememberMe) {
          localStorage.setItem('isAuthenticated', 'true')
          localStorage.setItem('username', encrypt(username))
        } else {
          sessionStorage.setItem('isAuthenticated', 'true')
          sessionStorage.setItem('username', encrypt(username))
        }
        toast.success('Successfully signed in')
        router.push('/')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        setIsResetting(false)
        setResetEmail('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to send reset instructions')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isResetting ? 'Reset Password' : 'Settings Access'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isResetting ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordStrength && (
                  <div className="space-y-2 text-sm">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        {passwordStrength.hasMinLength ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                        <span>8+ characters</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        {passwordStrength.hasUpperCase ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                        <span>Uppercase</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        {passwordStrength.hasLowerCase ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                        <span>Lowercase</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        {passwordStrength.hasNumber ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                        <span>Number</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        {passwordStrength.hasSpecialChar ? <Check size={14} className="text-green-500" /> : <X size={14} className="text-red-500" />}
                        <span>Special char</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetting(true)}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || (passwordStrength && !passwordStrength.isValid)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 py-6"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 py-6"
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setIsResetting(false)}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </form>
          )}
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
        </CardContent>
      </Card>
    </main>
  )
} 