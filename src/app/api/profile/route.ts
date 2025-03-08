import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Profile } from '@/types/social';

const PROFILE_FILE = path.join(process.cwd(), 'data', 'profile.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(PROFILE_FILE))) {
  fs.mkdirSync(path.dirname(PROFILE_FILE), { recursive: true });
}

// Initialize profile file if it doesn't exist
if (!fs.existsSync(PROFILE_FILE)) {
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
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2));
}

export async function GET() {
  try {
    const profile = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf-8'));
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error reading profile:', error);
    return NextResponse.json(
      { error: 'Failed to read profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const profile: Profile = await request.json();
    
    // Validate the profile data
    if (!profile.name || !profile.bio || !profile.avatar || !Array.isArray(profile.links)) {
      return NextResponse.json(
        { error: 'Invalid profile data' },
        { status: 400 }
      );
    }

    // Save the profile
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 