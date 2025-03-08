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
    await fs.access(PROFILE_FILE);
  } catch (error) {
    // Create the directory if it doesn't exist
    await fs.mkdir(path.dirname(PROFILE_FILE), { recursive: true });
    // Write default profile
    await fs.writeFile(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2));
  }
}

export async function GET() {
  try {
    await ensureProfileFile();
    
    const fileContent = await fs.readFile(PROFILE_FILE, 'utf-8');
    const profile = JSON.parse(fileContent);

    // Validate profile structure
    if (!profile || typeof profile !== 'object') {
      throw new Error('Invalid profile data structure');
    }

    return new NextResponse(JSON.stringify(profile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error reading profile:', error);
    
    // Return default profile if there's an error
    return new NextResponse(JSON.stringify(defaultProfile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureProfileFile();
    
    const profile: Profile = await request.json();
    
    // Validate the profile data
    if (!profile || typeof profile !== 'object') {
      return new NextResponse(JSON.stringify({ error: 'Invalid profile data format' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!profile.name || !profile.bio || !profile.avatar || !Array.isArray(profile.links)) {
      return new NextResponse(JSON.stringify({ error: 'Missing required profile fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Save the profile
    await fs.writeFile(PROFILE_FILE, JSON.stringify(profile, null, 2));
    
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update profile' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 