export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  backgroundColor: string;
}

export interface Profile {
  name: string;
  bio: string;
  avatar: string;
  links: SocialLink[];
} 