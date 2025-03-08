import { NextResponse } from 'next/server';
import { Profile } from '@/types/social';

// Default profile data
const defaultProfile = {
  name: process.env.NEXT_PUBLIC_PROFILE_NAME || 'Abir Mohanta',
  bio: process.env.NEXT_PUBLIC_PROFILE_BIO || 'Frontend Developer | UI/UX Designer | Graphic Designer',
  avatar: process.env.NEXT_PUBLIC_PROFILE_AVATAR || 'https://avatars.githubusercontent.com/u/76041181?v=4',
  links: [
    {
      id: '1',
      title: 'GitHub',
      url: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/AbirMohanta',
      icon: 'mdi:github',
      backgroundColor: '#333333',
    },
    {
      id: '2',
      title: 'LinkedIn',
      url: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/abir-mohanta-b5b2b7200/',
      icon: 'mdi:linkedin',
      backgroundColor: '#0077B5',
    },
    {
      id: '3',
      title: 'Instagram',
      url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/itsmeabirmohanta/',
      icon: 'mdi:instagram',
      backgroundColor: '#E4405F',
    },
    {
      id: '4',
      title: 'Twitter',
      url: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/AbhirMohanta',
      icon: 'mdi:twitter',
      backgroundColor: '#1DA1F2',
    },
    {
      id: '5',
      title: 'Portfolio',
      url: process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://abirmahanta.framer.website',
      icon: 'mdi:web',
      backgroundColor: '#4CAF50',
    }
  ],
};

// Validate profile data structure
function validateProfile(data: any): data is Profile {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.name !== 'string' || !data.name) return false;
  if (typeof data.bio !== 'string' || !data.bio) return false;
  if (typeof data.avatar !== 'string' || !data.avatar) return false;
  if (!Array.isArray(data.links)) return false;

  for (const link of data.links) {
    if (!link.id || !link.title || !link.url || !link.icon || !link.backgroundColor) return false;
  }

  return true;
}

let currentProfile = defaultProfile;

export async function GET() {
  try {
    return new NextResponse(JSON.stringify(currentProfile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error reading profile:', error);
    return new NextResponse(JSON.stringify(defaultProfile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return new NextResponse(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    
    if (!validateProfile(data)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid profile data structure' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the current profile in memory
    currentProfile = data;
    
    return new NextResponse(JSON.stringify({ success: true, profile: currentProfile }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to update profile'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 