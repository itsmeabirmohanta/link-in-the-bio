'use client'

import { useState, useEffect } from 'react'
import { profile as defaultProfile } from '@/data/profile'
import Image from 'next/image'
import { motion } from 'framer-motion'
import SettingsPanel from '@/components/SettingsPanel'
import { Profile } from '@/types/social'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorBoundary } from './ErrorBoundary'

export function ProfileCard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Try to load from localStorage first
        const localProfile = localStorage.getItem('profile');
        if (localProfile) {
          try {
            const parsedProfile = JSON.parse(localProfile);
            setProfile(parsedProfile);
          } catch (e) {
            console.error('Error parsing local profile:', e);
          }
        }

        // Load profile data from API
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response received');
        }
        const profileData = JSON.parse(text);
        if (!profileData || typeof profileData !== 'object') {
          throw new Error('Invalid profile data received');
        }
        
        // Update both state and localStorage
        setProfile(profileData);
        localStorage.setItem('profile', JSON.stringify(profileData));
        
        // Check authentication status
        const localAuth = localStorage.getItem('isAuthenticated')
        const sessionAuth = sessionStorage.getItem('isAuthenticated')
        setIsAuthenticated(localAuth === 'true' || sessionAuth === 'true')
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    };

    loadData();
  }, [])

  const handleProfileUpdate = async (updatedProfile: Profile) => {
    try {
      // Update localStorage first for immediate feedback
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Revert changes if API update fails
      const localProfile = localStorage.getItem('profile');
      if (localProfile) {
        try {
          const parsedProfile = JSON.parse(localProfile);
          setProfile(parsedProfile);
        } catch (e) {
          console.error('Error reverting profile:', e);
        }
      }
      toast.error(error instanceof Error ? error.message : 'Failed to save profile');
    }
  }

  const handleSettingsClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/signin')
      return
    }
    setIsSettingsOpen(true)
  }

  const handleSignOut = () => {
    // Clear both storage types
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('username')
    
    setIsAuthenticated(false)
    setIsSettingsOpen(false)
    toast.success('Signed out successfully')
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="relative">
        {/* Settings Toggle Button */}
        <motion.div
          className="absolute top-4 right-4 z-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            onClick={handleSettingsClick}
          >
            <Icon icon="solar:settings-linear" className="h-5 w-5" />
          </Button>
        </motion.div>

        {isAuthenticated && (
          <motion.div
            className="absolute top-4 right-16 z-40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              onClick={handleSignOut}
              title="Sign Out"
            >
              <Icon icon="solar:logout-linear" className="h-5 w-5" />
            </Button>
          </motion.div>
        )}

        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Profile Image */}
            <motion.div
              className="relative w-24 h-24 mx-auto mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={96}
                height={96}
                className="rounded-full object-cover ring-2 ring-purple-500/20 dark:ring-purple-400/20"
                priority
                unoptimized
              />
            </motion.div>

            {/* Profile Info */}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1">
              {profile.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{profile.bio}</p>

            {/* Social Links */}
            <div className="space-y-3">
              {profile.links.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <div className="p-4 flex items-center gap-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors border border-gray-200/50 dark:border-gray-700/50">
                      <Icon icon={link.icon} className="h-5 w-5" />
                      <span className="text-base font-medium">{link.title}</span>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Settings Panel */}
        {isAuthenticated && (
          <SettingsPanel
            profile={profile}
            onUpdate={handleProfileUpdate}
            onClose={() => setIsSettingsOpen(false)}
            isOpen={isSettingsOpen}
          />
        )}
      </div>
    </ErrorBoundary>
  )
} 