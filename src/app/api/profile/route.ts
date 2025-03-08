import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Profile } from '@/types/social';

const PROFILE_FILE = path.join(process.cwd(), 'data', 'profile.json');

// Default profile data
const defaultProfile = {
  name: 'Abir Mohanta',
  bio: 'Frontend Developer | UI/UX Designer | Graphic Designer',
  avatar: 'https://avatars.githubusercontent.com/u/76041181?v=4',
  links: [
    {
      id: '1',
      title: 'GitHub',
      url: 'https://github.com/AbirMohanta',
      icon: 'mdi:github',
      backgroundColor: '#333333',
    },
    {
      id: '2',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/abir-mohanta-b5b2b7200/',
      icon: 'mdi:linkedin',
      backgroundColor: '#0077B5',
    },
    {
      id: '3',
      title: 'Instagram',
      url: 'https://www.instagram.com/itsmeabirmohanta/',
      icon: 'mdi:instagram',
      backgroundColor: '#E4405F',
    },
    {
      id: '4',
      title: 'Twitter',
      url: 'https://twitter.com/AbhirMohanta',
      icon: 'mdi:twitter',
      backgroundColor: '#1DA1F2',
    },
    {
      id: '5',
      title: 'Portfolio',
      url: 'https://abirmahanta.framer.website',
      icon: 'mdi:web',
      backgroundColor: '#4CAF50',
    }
  ],
};

// Initialize profile file if it doesn't exist
async function ensureProfileFile() {
  try {
    await fs.access(path.dirname(PROFILE_FILE));
  } catch {
    await fs.mkdir(path.dirname(PROFILE_FILE), { recursive: true });
  }

  try {
    await fs.access(PROFILE_FILE);
  } catch {
    await fs.writeFile(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2));
  }
}

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

export async function GET() {
  try {
    await ensureProfileFile();
    
    const fileContent = await fs.readFile(PROFILE_FILE, 'utf-8');
    const profile = JSON.parse(fileContent);

    if (!validateProfile(profile)) {
      console.error('Invalid profile data in file');
      throw new Error('Invalid profile data structure');
    }

    return new NextResponse(JSON.stringify(profile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error reading profile:', error);
    
    // Return default profile if there's an error
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
    await ensureProfileFile();
    
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

    // Ensure the data directory exists before writing
    await fs.mkdir(path.dirname(PROFILE_FILE), { recursive: true });
    
    // Write the profile data
    await fs.writeFile(PROFILE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    
    return new NextResponse(JSON.stringify({ success: true, profile: data }), {
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